$(document).ready(function () {

  // send an HTTP DELETE request for the sign-out link
  $('a#sign-out').on("click", function (e) {
    e.preventDefault();
    var request = $.ajax({ url: $(this).attr('href'), type: 'delete' });
    request.done(function () { window.location = "/"; });
  });

  $("#graphy").submit(function( event ){

    response = $.ajax({
      url: '/result/show',
      type: 'POST',
      data: responseText,
      dataType: "json"
    });
    console.log(response);
    // done(function (data) {
    //   console.log("SUCCESS!");
    // })
  })
});
