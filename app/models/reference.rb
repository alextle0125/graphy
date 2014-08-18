class Reference < ActiveRecord::Base
  belongs_to :project
  validates :url, :uniqueness => true, :presence => true

end
