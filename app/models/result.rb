class Result < ActiveRecord::Base
  validates :topic, :presence => true
  # validates :user_id, :presence => true
  validates :file_data, :presence => true

  has_one :user
  has_many :project_results
  has_many :projects, through: :project_results
end
