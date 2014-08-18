function clearProject() {
  $('form#project').attr('action', '/users/' + userid + '/projects/new');
  $('form#project').attr('method', 'post');
  $('input[name="project[title]"').val('');
  $('textarea[name="project[note_content]"').val('');
}

$(document).ready(function() {

  var userid = $('#userid').val();
  var projectID;

  function fetchProject(projectID) {
    if (projectID !== 'null') {
      $.getJSON('/users/'+userid+'/projects/'+projectID, function(data){
        $('form#project').attr('action', '/users/'+userid+'/projects/'+projectID);
        $('form#project').attr('method', 'put');
        $('input[name="project[title]"').val(data.title);
        $('textarea[name="project[note_content]"').val(data.note_content);
        $('input[name="project[user_id]"').val(data.user_id);

        var newGraph = true;
        data.results.forEach(function(result, index, array){
          var dataArray = parseData(result);
          if (newGraph) {
            graph(dataArray, result.topic);
            newGraph = false;
            $('.metadata').css('display','inline-block');
          } else {
            addSeries(dataArray, result.topic, true);
          }
          addSeries(leastSquaresRegression(dataArray), result.topic + " LSR", false);
        });
      });
    }
  }

  // Select Project
  $('select#projectSelect').on('change', function(e) {
    projectID = $(this).val();
    fetchProject(projectID);
  });


  // Submit / Edit project
  $('form#project').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: form.serialize()
    }).done(function(response) {
      console.log(response);
      $('.feedback').html(response);
    });
  });

  // send an HTTP DELETE request for the sign-out link
  $('a#sign-out').on("click", function (e) {
    e.preventDefault();
    var request = $.ajax({ url: $(this).attr('href'), type: 'delete' });
    request.done(function() { window.location = "/"; });
  });

  $('.reset').click(function(e) {
    e.preventDefault();
    clearGraph();
    clearProject();
  });

  var newGraph = true;

  // Create / get result
  $('form[name="graphy"]').submit(function(e) {
    e.preventDefault();
    var query = toTitleCase($('input[name="criteria"]').val());
    $.ajax({
      url: '/result/show',
      type: 'POST',
      data: $('form[name="graphy"]').serialize(),
      dataType: "json"
    }).done(function(data){
      var dataArray = parseData(data);
      if (newGraph) {
        graph(dataArray, query);
        newGraph = false;
        $('.metadata').css('display','inline-block');
      } else {
        addSeries(dataArray, query, true);
      }
      addSeries(leastSquaresRegression(dataArray), query + " LSR", false);
      $('input[name="criteria"]').val('');
    });
  });

  // Add reference
  var containerHeight = 400;
  $("#references").submit(function( event ){
    event.preventDefault();
    $.ajax({
      url: '/users/' + userid + '/projects/'+ projectID + '/references',
      type: 'POST',
      data: $("#references").serialize(),
      dataType: "json"
    }).done(function(data) {
      console.log(data);
      $('input[name="link"]').val('');
      if (data.length > 75){
        $('p.references').append("<br><a href=\'" + data.url + "\'>" + data.url.substr(0,75) + "</a>");
        containerHeight += 25;
        $('.container').css('height', containerHeight + 'px');
      } else {
        $('p.references').append("<br><a href=\'" + data.url + "\'>" + data.url + "</a>");
        containerHeight += 25;
        $('.container').css('height', containerHeight + 'px');
      }
    });
  });

  // User project rendering

  $('.pure-menu li a').on('click', function( event ){
    event.preventDefault();
    var projectID = $(this).attr('href');
    if (projectID !== 'null') {
      $.getJSON('/users/'+userid+'/projects/'+projectID, function(data){
        console.log(data);
        $('form#project').attr('action', '/users/'+userid+'/projects/'+projectID);
        $('form#project').attr('method', 'put');
        $('input[name="project[title]"').val(data.title);
        $('textarea[name="project[note_content]"').val(data.note_content);
        $('input[name="project[user_id]"').val(data.user_id);
        var newGraph = true;

        data.results.forEach(function(result, index, array){
          var dataArray = parseData(result);
          if (newGraph) {
            graph(dataArray, result.topic);
            newGraph = false;
            $('.metadata').css('display','inline-block');
          } else {
            addSeries(dataArray, result.topic, true);
          }
          addSeries(leastSquaresRegression(dataArray), result.topic + " LSR", false);
        });
      });
    }
    $('.metadata_specific').css('display', 'inline-block');
  });

});


function clearProject() {
  $('form#project').attr('action', '/users/' + userid + '/projects/new');
  $('form#project').attr('method', 'post');
  $('input[name="project[title]"').val('');
  $('textarea[name="project[note_content]"').val('');
  $('input[name="project[user_id]"').val(data.user_id);
}
