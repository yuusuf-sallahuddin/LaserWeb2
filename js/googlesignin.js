function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  $('#gsignin').hide();
  $('#fullname').html(profile.getName());
   $("#userpic").attr("src", profile.getImageUrl());
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  $('#g-login').show();
  $('#g-logout').hide();
  $('#fullname').html('Please Sign In:');
  $("#userpic").attr("src", 'css/user64.gif');
}

var googleUser = {};
  var startApp = function() {
    console.log('Starting GSingIn')
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        // client_id: '1086441811451-4nmidqbqq8tve1qqa592uq1hs04kl5sl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('g-login'));
    });
  };

  function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          $('#g-login').hide();
          $('#g-logout').show();
          $('#fullname').html(  googleUser.getBasicProfile().getName());
           $("#userpic").attr("src", googleUser.getBasicProfile().getImageUrl());

          // document.getElementById('name').innerText = "Signed in: " +
          //     googleUser.getBasicProfile().getName();
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


$(document).ready(function() {
  startApp();
});
