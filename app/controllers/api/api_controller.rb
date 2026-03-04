class Api::ApiController < ActionController::API
  include ActionController::Head
  include Doorkeeper::Rails::Helpers

  respond_to :json
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  protected

  def doorkeeper_authorize!
    return super if doorkeeper_token

    if Rails.env.development?
      token_string = request.headers['Authorization']&.gsub(/\ABearer /, '')
      if token_string
        require 'net/http'
        require 'json'
        
        uri = URI('https://fablabs.io/api/me.json')
        req = Net::HTTP::Get.new(uri)
        req['Authorization'] = "Bearer #{token_string}"
        res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }

        if res.is_a?(Net::HTTPSuccess)
          prod_user = JSON.parse(res.body)
          
          local_user = User.find_or_initialize_by(email: prod_user['email'])
          if local_user.new_record?
            local_user.assign_attributes(
              username: prod_user['username'] || "user_#{SecureRandom.hex(4)}",
              first_name: prod_user['first_name'] || prod_user['name']&.split(' ')&.first || 'User',
              last_name: prod_user['last_name'] || prod_user['name']&.split(' ')[1..-1]&.join(' ') || 'Name',
              password: 'password',
              password_confirmation: 'password',
              workflow_state: 'verified'
            )
            local_user.save(validate: false)
          end

          app = Doorkeeper::Application.find_or_create_by!(name: 'Fablabs Sync') do |a|
            a.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
            a.confidential = false
            a.owner_id = local_user.id
            a.owner_type = 'User'
          end

          db_token = Doorkeeper::AccessToken.find_or_create_by!(
            token: token_string,
            resource_owner_id: local_user.id,
            application_id: app.id,
            scopes: 'public',
            expires_in: 7200
          )
          
          @doorkeeper_token = db_token
        end
      end
    end

    super
  end

  def paginate(scope, default_per_page = 10)
    collection = scope.page(params[:page]).per((params[:per_page] || default_per_page).to_i)

    current, total, per_page = collection.current_page, collection.total_pages, collection.limit_value

    pagination = {
      self:     current,
      per_page: per_page,
      pages:    total,
      count:    collection.total_count
    }
    if current > 1 then
      pagination[:prev] =  current - 1
    end
    if current != total then
      pagination[:next] =  current + 1
    end
    
    return [
      collection,
      pagination
    ]
  end

  def record_not_found error
    render json: { error: error.message }, status: :not_found
  end

  def current_user
    if doorkeeper_token
      @current_user ||= User.find(doorkeeper_token.resource_owner_id)
    end
  end

  def doorkeeper_unauthorized_render_options(error: nil)
    {
      json: {
        errors: [
          {
            status: "401",
            title: "Unauthorized",
            detail: error&.description || "Access token is missing or invalid"
          }
        ]
      }
    }
  end

end
