class Project < ActiveRecord::Base
  belongs_to :user
  has_many :project_results
  has_many :results, :through => :project_results
  has_many :references

  validates :title, :presence => true
end
