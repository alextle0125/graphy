class CreateProjectResults < ActiveRecord::Migration
  def change
    create_table :project_results do |t|
      t.belongs_to :project
      t.belongs_to :result
      t.belongs_to :user
      t.timestamps
    end
  end
end
