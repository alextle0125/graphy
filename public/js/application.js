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

  $('form[name="graphy"]').submit(function(e) {
    e.preventDefault();
    var query = toTitleCase($('input[name="criteria"]').val());
    $.ajax({
      url: '/result/show',
      type: 'POST',
      data: $('form[name="graphy"]').serialize(),
      dataType: "json"
    }).done(function(data){
      dataArray = parseData(data);
      if (newGraph) {
        graph(dataArray, query);
        newGraph = false;
        $('.metadata').css('display','inline-block')
      } else {
        addSeries(dataArray, query, true);
      }
      addSeries(leastSquaresRegression(dataArray), query + " LSR", false);
      $('input[name="criteria"]').val('');
    });
  });

  containerHeight = 400
  $("#references").submit(function( event ){
    event.preventDefault();

    $.ajax({
      url: '/users/:user_id/results/:result_id/links',
      type: 'POST',
      data: $("#references").serialize(),
      dataType: "json"
    }).done(function(data){
      if (data.length > 75){
        $('p.references').append("<br><a href=\'" + data + "\'>" + data.substr(0,75) + "</a>")
        containerHeight += 25
        $('.container').css('height', containerHeight + 'px')
      } else {
        $('p.references').append("<br><a href=\'" + data + "\'>" + data + "</a>")
        containerHeight += 25
        $('.container').css('height', containerHeight + 'px')
      };
    });
  });

});
