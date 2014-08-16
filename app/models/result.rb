class Result < ActiveRecord::Base
   validates :topic, :presence => true
   # validates :user_id, :presence => true
    validates :file_data, :presence => true

    belongs_to :user
end
