class Task < ActiveRecord::Base
	self.primary_key = 'uuid'
	has_many :tag
end
