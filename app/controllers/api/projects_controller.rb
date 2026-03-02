class Api::ProjectsController < Api::ApiController
  def index
    @projects = Project.all.page(params['page']).per(params['per'])
    render json: @projects
  end

  def show
    begin
      @project = Project.friendly.find(params[:id])
      # Add serializer if exists, else default json
      render json: @project
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Not found' }, status: :not_found
    end
  end
end
