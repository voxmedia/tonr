class PicturesController < ApplicationController
  # before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]
  before_action :set_user

  def new
  end

  def create
  end

  private

  def picture_params
    params.require(:picture).permit(:picture_url, :user_id)
  end

  def set_user
    @user = User.find(session[:user_id])
  end

  # def set_s3_direct_post
  #   @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  # end
end
