function clearProject() {
  $('form#project').attr('action', '/users/' + userid + '/projects/new');
  $('form#project').attr('method', 'post');
  $('input[name="project[title]"').val('');
  $('textarea[name="project[note_content]"').val('');
}

$(document).ready(function() {

  var userid = $('#userid').val();
  var projectID;

  function getProject(projectID) {
    if (projectID !== 'null') {
      $.getJSON('/users/'+userid+'/projects/'+projectID, function(response){
        setProjectFormValues(projectID, response);
        addReferences(response);
        graphResults(response);
      });
    }
  }

  function graphResults(response) {
    var newGraph = true;
    response.results.forEach(function(result, index, array){
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
  }

  function setProjectFormValues(projectID, project) {
    $('form#project').attr('action', '/users/'+userid+'/projects/'+projectID);
    $('form#project').attr('method', 'put');
    $('input[name="project[title]"').val(project.title);
    $('textarea[name="project[note_content]"').val(project.note_content);
    $('input[name="project[user_id]"').val(project.user_id);
    $('form#references').attr('action', '/users/'+userid+'/projects/'+projectID+'/references');
  }

  function addReferences(response) {
    $('p.references').html('References:');
    var references = response.references;
    references.forEach(function(reference) {
      addReference(reference);
    });
  }

  var containerHeight = 400;
  function addReference(reference){
    if (reference.length > 75){
      $('p.references').append("<br><a href=\'" + reference.url + "\'>" + reference.url.substr(0,75) + "</a>");
      containerHeight += 25;
      $('.container').css('height', containerHeight + 'px');
    } else {
      $('p.references').append("<br><a href=\'" + reference.url + "\'>" + reference.url + "</a>");
      containerHeight += 25;
      $('.container').css('height', containerHeight + 'px');
    }
  }


  // Select Project
  $('select#projectSelect').on('change', function(e) {
    projectID = $(this).val();
    getProject(projectID);
  });


  // Submit / Edit project
  $('form#project').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: form.serialize(),
      dataType: 'json'
    }).done(function(response) {
      setProjectFormValues(response.id, response);
      $('.feedback').html("Project Saved!").hide().fadeIn(100).delay(1000).fadeOut();
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
  $("#references").submit(function( event ){
    event.preventDefault();
    form = $(this);
    $.ajax({
      url: form.attr('action'),
      type: 'POST',
      data: $("#references").serialize(),
      dataType: "json"
    }).done(function(data) {
      $('input[name="link"]').val('');
      addReference(data);
    });
  });


  // User project rendering
  $('.pure-menu li a').on('click', function( event ){
    event.preventDefault();
    $('.placeholder').hide();
    var projectID = $(this).attr('href');
    getProject(projectID);

    $('.metadata_specific').css('display', 'inline-block');
  });
});
