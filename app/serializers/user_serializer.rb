class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :name, :first_name, :last_name, :email, :avatar_url 
  has_many :employees

  def name
    [object.first_name, object.last_name].compact.join(" ").presence || object.username || "Unknown Maker"
  end

  def avatar_url
    # Use real url if it exists, otherwise deterministic placeholder
    if object.avatar_uid.present?
      object.avatar.thumb('150x150#').url(host: 'https://www.fablabs.io')
    else
      "https://i.pravatar.cc/150?u=#{object.id}"
    end
  end
end
