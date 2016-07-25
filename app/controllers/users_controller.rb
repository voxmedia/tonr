class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
  end

  def tweet
    begin
      client.update_with_media("I used http://tonr.co for this, and you should too!", params[:file])
    rescue Twitter::Error
      flash[:error] = "Your tōnr couldn't be tweeted :/"
      redirect_to "/"
    else
      flash[:success] = "Your tōnr was successfully tweeted!"
      redirect_to "/"
    end
  end

  private

  def user_params
    params.require(:user).permit(:provider, :uid, :name, :oauth_token, :oauth_token_secret, :oauth_expires_at, :email)
  end
end