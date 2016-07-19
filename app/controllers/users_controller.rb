class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
  end

  private

  def user_params
    params.require(:user).permit(:provider, :uid, :name, :oauth_token, :oauth_token_secret, :oauth_expires_at, :email)
  end
end