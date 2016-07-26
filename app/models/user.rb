class User < ActiveRecord::Base
  has_many :pictures, dependent: :destroy

  validates_uniqueness_of :name

  def self.from_omniauth(auth)
    if auth.info.present?
      user_name = auth.info.name
    elsif auth["credentials"].present?
      user_name = client.user(include_entities: true).name
    end

    where(name: user_name).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = user_name
      user.email = auth.try(:email)
      user.oauth_token = auth.credentials.token
      user.oauth_token_secret = auth.credentials.secret
      logger.debug(auth.inspect)
      user.save!
    end
  end
end