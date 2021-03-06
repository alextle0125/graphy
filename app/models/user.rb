class User < ActiveRecord::Base

  before_save { self.email = email.downcase }
  validates :name, presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, length: { minimum: 6 }

  has_many :projects
  has_many :project_results
  has_many :results, through: :projects

  # def self.authenticate(email, password)
  #   user = User.find_by_email(email)
  #   return user if user && (user.authenticate(password))
  #   nil
  # end

end
