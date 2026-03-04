Rails.application.routes.draw do
  use_doorkeeper

  namespace :api, defaults: { format: :json } do
    resources :labs, only: [:index, :show], param: :slug
    resources :users, only: [:show], param: :slug
    resources :projects, only: [:index, :show], param: :slug
    resources :machines, only: [:index, :show], param: :slug
    resources :activities, only: [:index]
    
    get 'search', to: 'search#index'
    
    # Profile management
    get 'profile', to: 'profile#show'
    put 'profile', to: 'profile#update'
  end
end
