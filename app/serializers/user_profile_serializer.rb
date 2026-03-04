class UserProfileSerializer < ActiveModel::Serializer
  attributes :id, :username, :first_name, :last_name, :name, :email, :avatar_url, :bio, 
             :city, :country_code, :created_at, :social_links, :badges

  has_many :projects, serializer: ProjectSerializer
  has_many :labs, serializer: LabSerializer
  has_many :links, serializer: LinkSerializer

  def name
    [object.first_name, object.last_name].compact.join(" ").presence || object.username || "Unknown Maker"
  end

  def badges
    user_badges = []
    
    # Fab Academy Graduates
    if object.academics.any? { |a| a.graduated_in.present? }
      user_badges << "fab_academy"
    end

    # Bootcamps and Global Events via Rolify
    if object.has_role?(:bootcamp)
      user_badges << "bootcamp"
    end

    if object.has_role?(:global_event)
      user_badges << "global_event"
    end

    # Academic Publications via External Links
    if object.links.any? { |l| l.url.downcase.include?('scholar.google') || l.url.downcase.include?('orcid.org') }
      user_badges << "academic_published"
    end

    user_badges
  end

  def avatar_url
    if object.avatar_uid.present?
      object.avatar.thumb('300x300#').url(host: 'https://www.fablabs.io')
    else
      "https://i.pravatar.cc/300?u=#{object.id}"
    end
  end

  def social_links
    links = {}
    ['twitter', 'github', 'instagram', 'facebook', 'linkedin', 'web', 'vimeo', 'youtube'].each do |platform|
      val = object.public_send(platform) if object.respond_to?(platform)
      links[platform] = val if val.present?
    end
    links
  end

  def projects
    # Return projects the user has contributed to or owns
    object.projects.distinct
  end

  def labs
    # Return labs the user is an approved employee/member of
    Lab.joins(:employees).where(employees: { user_id: object.id, workflow_state: 'approved' }).distinct
  end
end
