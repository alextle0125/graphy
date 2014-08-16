$(document).ready(function() {

  // send an HTTP DELETE request for the sign-out link
  $('a#sign-out').on("click", function (e) {
    e.preventDefault();
    var request = $.ajax({ url: $(this).attr('href'), type: 'delete' });
    request.done(function() { window.location = "/"; });
  });

  $('#reset').click(function(e) {
    e.preventDefault();
    clearGraph();
  });

  var newGraph = true;

  $("#graphy").submit(function(e) {
    e.preventDefault();
    var query = toTitleCase($('input[name="criteria"]').val());
    $.ajax({
      url: '/result/show',
      type: 'POST',
      data: $("#graphy").serialize(),
      dataType: "json"
    }).done(function(data){
      dataArray = parseData(data);
      if (newGraph) {
        graph(dataArray, query);
        newGraph = false;
      } else {
        addSeries(dataArray, query, true);
      }
      addSeries(leastSquaresRegression(dataArray), query + " LSR", false);
      $('input[name="criteria"]').val('');
    });
  });
});
