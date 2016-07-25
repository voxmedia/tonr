class PicturesController < ApplicationController
  before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]
  before_action :set_user

  def new
  end

  def upload
    # Make an object in your bucket for your upload
    obj = S3_BUCKET.object("#{SecureRandom.uuid}")

    # Upload the file
    obj.upload_file(params[:file].tempfile)

    # Save the upload
    @picture = Picture.new(picture_url: obj.public_url, user_id: current_user.id)
    if @picture.save!
      flash[:success] = "Your image was successfully saved"
      redirect_to '/'
    else
      flash[:error] = "Something was wrong and the image couldn't be saved :/"
      redirect_to '/'
    end
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

  def set_s3_direct_post
    @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  end
end
