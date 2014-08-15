require 'faker'

# create a few users
# User.create :name => 'Dev Bootcamp Student', :email => 'me@example.com', :password => 'password'
# 5.times do
#   User.create :name => Faker::Name.name, :email => Faker::Internet.email, :password => 'password'
# end


foods = ['Lettuce', 'Yogurt', 'Beef', 'Chicken', 'Milk', 'Ice cream']
foods.each do |type|
  id = rand(1..5)
  Result.create(topic: type, file_data: Faker::Lorem.paragraph, user_id: id, notes: Faker::Lorem.sentences)
end

