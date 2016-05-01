var googleUser = {};

var startApp = function() {
    console.log('Starting GSingIn')

    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '1086441811451-4nmidqbqq8tve1qqa592uq1hs04kl5sl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        scope: 'https://www.googleapis.com/auth/drive'
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
          $('#fullname').html( 'Logged in as: <b>' + googleUser.getBasicProfile().getName() + '</b>');
           $("#userpic").attr("src", googleUser.getBasicProfile().getImageUrl());
           gapi.client.load('drive', 'v3', function(){
             console.log('Drive Loaded');
             listFiles();
           });
        }, function(error) {
          console.log(JSON.stringify(error, undefined, 2));
        });
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



/**
* Print files.
*/
function listFiles() {
 var request = gapi.client.drive.files.list({
     'pageSize': 10,
     'fields': "nextPageToken, files(id, name)"
   });

   request.execute(function(resp) {
     appendPre('Files:');
     var files = resp.files;
     if (files && files.length > 0) {
       for (var i = 0; i < files.length; i++) {
         var file = files[i];
         appendPre(file.name);
         //appendPre(file.name + ' (' + file.id + ')<br>');
       }
     } else {
       appendPre('No files found.');
     }
   });
}

 /**
  * Append a pre element to the body containing the given message
  * as its text node.
  *
  * @param {string} message Text to be placed in pre element.
  */
function appendPre(message) {
   var pre = document.getElementById('output');
   var textContent = document.createTextNode(message + '\n');
   pre.appendChild(textContent);
}

$(document).ready(function() {
  startApp();
});
