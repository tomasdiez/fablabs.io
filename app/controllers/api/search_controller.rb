class Api::SearchController < Api::ApiController
  include LabsSearch
  include ProjectsOperations

  def index
    query = params[:q]
    
    # 1. Search Labs
    labs = search_labs(query).limit(10)
    
    # 2. Search Users
    users = search_users_basic(query).limit(10)
    
    # 3. Search Projects
    projects = search_projects(query).take(10)
    
    # 4. Search Machines
    machines = search_machines(query).limit(10)
    
    render json: {
      labs: ActiveModelSerializers::SerializableResource.new(labs, each_serializer: LabSerializer),
      users: ActiveModelSerializers::SerializableResource.new(users, each_serializer: UserSerializer),
      projects: projects.as_json(only: [:id, :title, :slug]), # Fixed Fallback
      machines: ActiveModelSerializers::SerializableResource.new(machines, each_serializer: MachineSerializer)
    }
  end

  private

  def search_users_basic(query)
    return User.none if query.blank?
    User.where('username ILIKE ? OR first_name ILIKE ? OR last_name ILIKE ?', "%#{query}%", "%#{query}%", "%#{query}%")
  end

  def search_machines(query)
    return Machine.none if query.blank?
    Machine.where('name ILIKE ? OR description ILIKE ?', "%#{query}%", "%#{query}%")
  end
end
