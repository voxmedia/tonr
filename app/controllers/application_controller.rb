class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def client
    @client ||= Twitter::REST::Client.new do |config|
      config.consumer_key = ENV['TWITTER_API_KEY']
      config.consumer_secret = ENV['TWITTER_API_SECRET']
      config.access_token = current_user.oauth_token
      config.access_token_secret = current_user.oauth_token_secret
    end
  end
end
