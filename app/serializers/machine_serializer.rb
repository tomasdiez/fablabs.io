class MachineSerializer < ActiveModel::Serializer
  attributes :id, :brand, :name, :image_url

  def image_url
    "https://picsum.photos/seed/machine_#{object.id}/400/300"
  end
end
