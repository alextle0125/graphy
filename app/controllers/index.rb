#----------- INDEX -----------

get '/' do
  # render home page
  @users = User.all

  erb :index
end


#----------- SESSIONS -----------

post '/sessions' do
  @email = params[:email]
  user = User.authenticate(@email, params[:password])
  if user
    # successfully authenticated; set up session and redirect
    session[:user_id] = user.id
    redirect '/'
  else
    # an error occurred, re-render the sign-in form, displaying an error
    @error = "Invalid email or password."
    erb :sign_in
  end
end

delete '/sessions/:id' do
  # sign-out -- invoked via AJAX
  return 401 unless params[:id].to_i == session[:user_id].to_i
  session.clear
  200
end


#----------- USERS -----------


get '/users/new' do
  # render sign-up page
  @user = User.new
  erb :sign_up
end

post '/users/new' do
  # sign-up
  @user = User.new params[:user]
  if @user.save
    # successfully created new account; set up the session and redirect
    session[:user_id] = @user.id
    redirect '/'
  else
    # an error occurred, re-render the sign-up form, displaying errors
    erb :sign_up
  end
end

get '/users/:user_id' do
  @user = User.find(params[:user_id])
  @results = @user.results

  erb :'users/show'
end


#----------- RESULTS -----------

post '/result/show' do
  @result = Result.find_or_initialize_by(topic: params[:criteria])
  if @result.new_record?
    @result.update_attributes(
      topic: params[:criteria],
      file_data: get_fda_data(params[:criteria]),
      user_id: session[:user_id]
    )
  end

  @result.to_json
end


get '/users/:user_id/results/:result_id' do
  @result = Result.find(params[:result_id])
  erb :'results/show'
end

get '/users/:user_id/results/:result_id/links' do
  redirect '/'
end

post '/users/:user_id/results/:result_id/links' do
  @link = params[:link]
  @link.to_json
end


