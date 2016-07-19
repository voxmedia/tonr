class PicturesController < ApplicationController
  before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]
  before_action :set_user

  def new
  end

  def create
    @picture = Picture.new(picture_params)
    if @picture.save!
      flash[:success] = "Successfully created..."
      redirect_to '/'
    else
      flash[:error] = "no created..."
      redirect_to '/'
    end
  end

private
  def picture_params
    params.require(:picture).permit(:picture_url, :user_id)
  end

  def set_user
    @user = User.find(session[:user_id])
  end

  def set_s3_direct_post
    @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  end
end
