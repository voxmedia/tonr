class EditorController < ApplicationController
  # before_action :set_s3_direct_post, only: [:home]

  def home
    @picture = Picture.new
    # @data = { 'form-data' => (@s3_direct_post.fields), 'url' => @s3_direct_post.url, 'host' => URI.parse(@s3_direct_post.url).host }
  end

  private

  # def set_s3_direct_post
  #   @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  # end
end