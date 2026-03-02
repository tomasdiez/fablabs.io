class Api::EventsController < Api::ApiController
  def index
    @events = Event.upcoming.includes(:lab).order('starts_at ASC').page(params['page']).per(params['per'])
    render json: @events
  end

  def show
    begin
      @event = Event.find(params[:id])
      render json: @event
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Not found' }, status: :not_found
    end
  end
end
