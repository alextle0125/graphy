class Project < ActiveRecord::Base
  belongs_to :user
  has_many :project_results
  has_many :results, :through => :project_results

  serialize :references
end
