class RemoveTaskFromTags < ActiveRecord::Migration
  def change
  	remove_column :tags, :task
  end
end
