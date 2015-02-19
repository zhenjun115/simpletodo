class ChangeTaskIdFromTags < ActiveRecord::Migration
  def change
  	change_column :tags, :task_id, :string
  end
end
