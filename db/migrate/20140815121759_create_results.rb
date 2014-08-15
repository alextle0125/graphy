class CreateResults < ActiveRecord::Migration
  def change
     create_table :results do |t|
      t.string :topic
      t.text :file_data
      t.integer :user_id
      t.text :notes
      t.timestamps
    end
  end
end
