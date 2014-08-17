class Reference < ActiveRecord::Base
  belongs_to :project
  validates :url, :presence => true

end
