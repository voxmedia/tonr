Rails.application.routes.draw do
  root "editor#home"
  get "/demo", to: "editor#demo"
  resources :users
  resources :pictures, except: [:update, :edit]

  #Oauth
  get '/auth/twitter/callback', to: 'sessions#create', as: 'callback'
  get '/auth/failure', to: 'sessions#error', as: 'failure'
  get '/profile', to: 'sessions#show', as: 'show'
  delete '/signout', to: 'sessions#destroy', as: 'signout'

  #Post to Twitter
  post '/tweet', to: 'users#tweet'

  #Upload to S3
  post '/upload', to: 'pictures#upload'
end
