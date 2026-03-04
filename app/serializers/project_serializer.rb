class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :slug, :featured_image_url
end
