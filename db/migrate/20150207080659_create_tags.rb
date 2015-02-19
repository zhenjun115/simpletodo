class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.string :task
      t.references :task, index: true

      t.timestamps null: false
    end
    add_foreign_key :tags, :tasks
  end
end
