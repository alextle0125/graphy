class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :title
      t.text :note_content
      t.text :references
      t.belongs_to :user
      t.timestamps
    end
    remove_column :results, :notes
  end
end
