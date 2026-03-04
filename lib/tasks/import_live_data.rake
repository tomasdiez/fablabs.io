namespace :import do
  desc "Import a batch of real Labs from the production fablabs.io API for local development"
  task live_labs: :environment do
    require 'net/http'
    require 'json'

    puts "Starting import from live Fablabs.io API..."
    
    # We fetch the main list which has ~2000 labs.
    # To avoid hammering the server, we'll just process the first 50 
    # and their individual detailed profiles.
    url = URI.parse('https://fablabs.io/api/labs.json')
    response = Net::HTTP.get_response(url)
    
    unless response.is_a?(Net::HTTPSuccess)
      puts "Failed to fetch labs list: #{response.code}"
      exit
    end

    labs_data = JSON.parse(response.body)
    labs_to_process = labs_data.first(50)

    puts "Fetched #{labs_data.size} labs. Processing the first #{labs_to_process.size}..."

    labs_to_process.each_with_index do |lab_summary, index|
      slug = lab_summary['slug']
      puts "[#{index + 1}/#{labs_to_process.size}] Processing #{slug}..."

      # Try to fetch the detailed profile if it exists (some might 404 on live as we saw)
      detail_url = URI.parse("https://api.fablabs.io/0/labs/#{slug}.json")
      detail_response = Net::HTTP.get_response(detail_url)

      lab_attrs = {
        name: lab_summary['name'],
        slug: slug,
        blurb: lab_summary['blurb'] || "A fantastic Fab Lab located in #{lab_summary['city']}",
        description: lab_summary['description'] || "Detailed description pending.",
        city: lab_summary['city'],
        country_code: lab_summary['country_code'] || 'US',
        latitude: lab_summary['latitude'] || 0.0,
        longitude: lab_summary['longitude'] || 0.0,
        email: "contact@#{slug}.example.com", # Fallback since email isn't in public summary
        phone: "+1 234 567 890",
        address_1: "123 Maker Street",
        kind: Lab.kinds.keys.include?(lab_summary['kind_name']) ? lab_summary['kind_name'] : 'fab_lab',
        capabilities: Lab::Capabilities.dup, # Give them all capabilities for testing
        workflow_state: 'approved' # Ensure it shows up in our queries
      }

      if detail_response.is_a?(Net::HTTPSuccess)
        detail_data = JSON.parse(detail_response.body)
        lab_attrs[:description] = detail_data['description'] if detail_data['description'].present?
        lab_attrs[:email] = detail_data['email'] if detail_data['email'].present?
        lab_attrs[:phone] = detail_data['phone'] if detail_data['phone'].present?
        lab_attrs[:address_1] = detail_data['address_1'] if detail_data['address_1'].present?
      end

      # Upsert the Lab
      lab = Lab.find_or_initialize_by(slug: slug)
      lab.assign_attributes(lab_attrs)
      
      if lab.save(validate: false) # Skip strict validations like terms acceptance for seeds
        
        # --- SCRAPE PUBLIC HTML FOR REAL LINKS & EMPLOYEES ---
        begin
          doc = Nokogiri::HTML(URI.open("https://fablabs.io/labs/#{slug}"))
          
          # Real URLs in the profile links section
          doc.css('.profile-links a').each do |link|
             href = link['href']
             lab.links.find_or_create_by!(url: href) if href && href.include?('http')
          end

          # Real Employees / Academics
          doc.css('.list-item-small-content a.text-medium').each do |link|
            name = link.text.strip
            user_path = link['href']
            user_slug = user_path.split('/').last if user_path

            if name.present? && user_slug.present?
              user = User.find_or_initialize_by(username: user_slug)
              # Set dummy password/email for local DB so they pass schema constraints
              user.assign_attributes(
                first_name: name.split(' ').first, 
                last_name: name.split(' ')[1..-1]&.join(' '), 
                email: "#{user_slug}@example.com", 
                password: 'password', 
                password_confirmation: 'password'
              )
              user.save(validate: false)
              
              # Safely create association
              lab.employees.find_or_initialize_by(user_id: user.id).save(validate: false)
            end
          end
        rescue OpenURI::HTTPError => e
          # Usually 404 or 406 if the page is missing or protected
        rescue => e
          puts "Scrape warning for #{slug}: #{e.message}"
        end

        print "."
      else
        puts " Failed to save #{slug}: #{lab.errors.full_messages.join(', ')}"
      end
    end

    puts "\nDone! Imported #{labs_to_process.size} real labs with rich dummy relations into the local database."
  end
end
