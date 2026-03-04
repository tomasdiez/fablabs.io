module Api
  class ProfileController < ApiController
    before_action :doorkeeper_authorize!

    def show
      if current_user.unverified?
        render json: { error: 'Verify your account first' }, status: :unauthorized
      else
        render json: UserProfileSerializer.new(current_user).serializable_hash
      end
    end

    def update
      if current_user.update(user_params)
        render json: UserProfileSerializer.new(current_user).serializable_hash
      else
        render json: { error: current_user.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(
        :first_name, :last_name, :bio, :avatar, :url, :city, :country_code,
        links_attributes: [:id, :url, :_destroy]
      )
    end
  end
end
