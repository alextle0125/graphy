class ProjectResult < ActiveRecord::Base
  belongs_to :project
  belongs_to :result
  belongs_to :user
end
