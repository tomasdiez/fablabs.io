class ActivitySerializer
  include JSONAPI::Serializer
  attributes :action, :created_at, :trackable_type, :trackable_id

  attribute :actor do |object|
    if object.actor
      {
        id: object.actor.id,
        name: [object.actor.first_name, object.actor.last_name].compact.join(' '),
        slug: object.actor.slug
      }
    end
  end

  attribute :trackable do |object|
    if object.trackable
      {
        id: object.trackable.id,
        type: object.trackable_type,
        name: object.trackable.try(:name) || object.trackable.try(:title) || "Unknown",
        slug: object.trackable.try(:slug)
      }
    end
  end
end
