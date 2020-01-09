// login
let google_token = null
function onSignIn(googleUser) {
  google_token = googleUser.getAuthResponse().id_token
  // console.log(google_token);
  $.ajax({
    method : 'POST',
    url : 'http://localhost:3000/user/google-login',
    data : {
      google_token
    }
  })
  .done( user => {
    console.log(user);
    
  })
  .fail( err => {
    console.log(err);
  })
}
//logout
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
     console.log('User signed out.');
  });
}
