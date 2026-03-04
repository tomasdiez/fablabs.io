module Api
  class ActivitiesController < ApplicationController
    def index
      # Fetch the latest 50 activities globally
      @activities = Activity.includes(:actor, :trackable)
                            .order(created_at: :desc)
                            .limit(50)

      render json: ActivitySerializer.new(@activities).serializable_hash
    end
  end
end
