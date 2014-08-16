$(document).ready(function () {

  // send an HTTP DELETE request for the sign-out link
  $('a#sign-out').on("click", function (e) {
    e.preventDefault();
    var request = $.ajax({ url: $(this).attr('href'), type: 'delete' });
    request.done(function () { window.location = "/"; });
  });

  $("#graphy").submit(function( event ){
    event.preventDefault();

    $.ajax({
      url: '/result/show',
      type: 'POST',
      data: $("#graphy").serialize(),
      dataType: "json"
    }).done(function(data){
      graphData(data);
      $('.metadata').css('display','inline-block')
      // $('#container').append("<br><form name=\'project\' id=\'project\' action=\'/users/:user_id/results/new\' method=\'post\'><input type=\'text\' name=\'project[:title]\' placeholder=\'Title\'><br><textarea name=\'project[:notes]\' placeholder=\'Write some important notes\' rows=\'7\' cols=\'50\'></textarea><br><p style=\'color: #999\'>References:</p><form name=\'references\' id=\'references\' action=\'/users/:user_id/results/:result_id/links\' method=\'post\'><input type=\'text\' name=\'project[:link]\' placeholder=\'Tack on important links\'><input type=\'submit\' value=\'URL\'></form><input type=\'submit\' value=\'Save Project\'></form>");
    });
  });

  containerHeight = 500
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
