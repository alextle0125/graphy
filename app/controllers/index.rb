#----------- INDEX -----------

get '/' do
  # render home page
  @users = User.all
  session[:current_results] = []
  p session
  p current_user
  erb :index
end


#----------- SESSIONS -----------

post '/sessions' do
  if params[:signin] == "Sign In"
    user = User.find_by(email: params[:user][:email])
    if user && user.authenticate(params[:user][:password])
    # successfully authenticated; set up session and redirect
      session[:user_id] = user.id
      redirect '/'
    else
    # an error occurred, re-render the sign-in form, displaying an error
      @error = "Invalid email or password."
      erb :sign_in
    end
  elsif params[:signin] == "Sign Up"
    generate_new_user
    if @user.save
    # successfully created new account; set up the session and redirect
      session[:user_id] = @user.id
      redirect '/'
    end
  end
end

delete '/sessions/:id' do
  # sign-out -- invoked via AJAX
  return 401 unless params[:id].to_i == session[:user_id].to_i
  session.clear
  200
end


#----------- USERS -----------

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
  if !session[:current_results]
    session[:current_results] = [@result.id]
  else
    session[:current_results] << @result.id
  end
  session[:current_results].uniq!
  p session
  @result.to_json
end

get '/users/:user_id/results/:result_id' do
  @result = Result.find(params[:result_id])
  erb :'results/show'
end

get '/users/:user_id/results/:result_id/links' do
  redirect '/'
end

#----------- PROJECTS -------------
post '/users/:user_id/projects/new' do
  @project = Project.create(params[:project])
  if @project.valid?
    session[:current_results].each do |result_id|
      ProjectResult.create(result_id: result_id, project_id: @project.id, user_id: current_user.id)
    end
    session[:project_id] = @project.id
    "Project saved."
  else
    @project.errors.full_messages
  end
end



get '/users/:user_id/projects/:project_id' do
  @project = Project.find(params[:project_id])
  session[:current_results] = @project.results.map do |result|
    result.id
  end
  @project.to_json(:include => :results)
end

put '/users/:user_id/projects/:project_id' do
  @project = Project.find(params[:project_id])
  @project.update_attributes(params[:project])
  if @project.valid?
    session[:current_results].each do |resultid|
      proj_res = ProjectResult.find_or_initialize_by(result_id: resultid, project_id: @project.id)
      proj_res.update_attributes(user_id: current_user.id)
      proj_res.save
    end
    session[:project_id] = @project.id
    "Project saved"
  else
    @project.errors.full_messages
  end
end

#----------- REFERENCES -------------
post '/users/:user_id/projects/:project_id/references' do
  @project = Project.find_or_initialize_by(id: params[:project_id])
  @link = Reference.find_or_create_by(url: params[:link], project_id: params[:project_id])
  p @link
  @link.to_json
end

