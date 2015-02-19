class Tag < ActiveRecord::Base
	self.primary_key = "task"
  	belongs_to :task, foreign_key: "uuid"
end
