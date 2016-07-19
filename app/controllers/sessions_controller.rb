class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(env["omniauth.auth"])
    if user.present?
      session[:user_id] = user.id
      redirect_to root_path, notice: 'Signed in'
    else
      redirect_to failure_path
    end
  end

  def error
    flash[:error] = 'Sign in with Twitter FAILED'
    redirect_to root_path
  end

  def destroy
    reset_session
    redirect_to root_path, notice: 'Signed out'
  end
end