require 'bundler'

lockfile = Bundler::LockfileParser.new(File.read('Gemfile.lock'))
lockfile.specs.each do |spec|
  next if spec.name == 'hpricot'
  puts "Installing #{spec.name} -v #{spec.version}..."
  success = system("gem install #{spec.name} -v #{spec.version} --no-document")
  unless success
    puts "Failed to install #{spec.name} -v #{spec.version}"
    exit 1
  end
end
puts "All gems successfully installed from Gemfile.lock"
