class CreateReferences < ActiveRecord::Migration
  def up
    create_table :references do |t|
      t.string :url
      t.belongs_to :project
      t.timestamps
    end
    remove_column :projects, :references
  end

  def down
    drop_table :references
    add_column :projects, :references, :text
  end
end
