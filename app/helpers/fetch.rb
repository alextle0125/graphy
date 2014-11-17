require "net/http"
require "uri"

helpers do
  def get_fda_data(query)
    query_root = 'https://api.fda.gov/food/enforcement.json?api_key=XajdC2VfR2I2IMvZFabHpZGG7z5v17Sii1Jg62JF&search=reason_for_recall:';
    query_suffix = '&count=report_date'
    uri_string = URI.escape(query_root + '"' + query + '"' + query_suffix)
    uri = URI.parse(uri_string)
    Net::HTTP.get(uri)
  end

  def get_project_id
    session[:project_id] || next_project_id
  end

  def next_project_id
    Project.last ? Project.last.id + 1 : 1
  end

  def generate_new_user
    generate_user_name = params[:user][:email].scan(/(.*)@/)
    generate_user_name = generate_user_name[0][0]
    @user = User.new(params[:user])
    @user.update(name: generate_user_name)
    return @user
  end

  def get_user_name
    @user ||= User.find(session[:user_id]) if session[:user_id]
    return @user.name
  end
end
