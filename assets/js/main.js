let tampung
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
  .done( token => {
    console.log(token);
    //localstorage
    localStorage.setItem('token', token)
    tampung = token
    getAnime()
    toggleLogin(0)
    togglePage(1)
    //
  })
  .fail( err => {
    console.log(err);
  })
}
//logout
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    tampung = null
    console.log('User signed out.');
    toggleLogin(1)
    togglePage(0)
  });
}

function getAnime() {
  const token = localStorage.getItem('token')
  $.ajax({
    method : 'GET',
    url : 'http://localhost:3000/anime',
    headers : {
      token
    }
  })
    .done( data => {
      console.log(data, '...')
    })
    .fail(err => {
      console.log(err);
    })
}

function toggleLogin(n) {
  if(n) {
    $('#login-page').show()
  } else {
    $('#login-page').hide()
  }
}

function togglePage(n) {
  if(n) {
    $('#page').show()
  } else {
    $('#page').hide()
  }
}

$(document).ready(function(){
  
  const token = localStorage.getItem('token')
  if(token) {
    togglePage(1)
    toggleLogin(0)
    getAnime()
  } else {
    toggleLogin(1)
    togglePage(0)
  }

})