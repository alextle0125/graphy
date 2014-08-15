require "net/http"
require "uri"

helpers do
  def get_fda_data(query)
    query_root = 'https://api.fda.gov/food/enforcement.json?api_key=ZObiWB8cMRYRRfPNnf41BGCLvXViUbNfTw6zHODr&search=reason_for_recall:';
    query_suffix = '&count=report_date'
    uri_string = URI.escape(query_root + '"' + query + '"' + query_suffix)
    uri = URI.parse(uri_string)
    Net::HTTP.get(uri)
  end

end