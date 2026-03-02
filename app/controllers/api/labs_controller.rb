class Api::LabsController < Api::ApiController
  include LabsOperations

  def index
    @labs = Lab.with_approved_state.includes(:links)
    render json: @labs, each_serializer: LabSerializer
  end

  def show
    begin
      @lab = with_approved_or_pending_state(params[:slug])
      # The UI controller includes many associations.
      render json: @lab, serializer: LabSerializer
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Not found' }, status: :not_found
    end
  end

end
