let access_token
let dataAnime
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
    access_token = token
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
    access_token = null
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
    },
    beforeSend: function () {
      $('#repo-container').html(`<div class="d-flex justify-content-center p-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`);
   }
  })
    .done( data => {
      // dataAnime = 
      let content = ``
      for (let i = 0; i < 10; i++) {
         let item = data[i];
         content += `
            <div class='repo-item p-2 border-bottom'>
              <img src='${item.image_url}'>
               <p class='font-weight-bold' onClick="openDescription(${item.mal_id})">${item.title}</p>
               <div class='row'>
                  <div class='col'> ${item.score} Score</div>
                  <div class='col'>
                    <a href="#boxes" onClick="favAnime(${item.mal_id})"> Fav this anime</a>
                     <a href="${item.url}" target="_blank">
                        View on MyAnimeList
                     </a>
                  </div>
               </div>
            </div>
         `
      }
      $('#jikan-topten').html(content);
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

function searchAnime(animeName){
  $.ajax({
      method : 'GET',
      url : `http://localhost:3000/anime/search/${animeName}`,
    beforeSend: function () {
       $('#repo-container').html(`<div class="d-flex justify-content-center p-3">
       <div class="spinner-border" role="status">
         <span class="sr-only">Loading...</span>
       </div>
     </div>`);
    }
 })
    .done(function (data) {
       console.log(data)
      //  if (data.data.total_count) {
      //     let content = ``
      //     for (let i = 0; i < data.data.total_count; i++) {
      //        let item = data.data.items[i];
      //        content += `
      //        <div class='repo-item p-2 border-bottom'>
      //           <p class='font-weight-bold'>${item.full_name}</p>
      //           <p>${item.description || '<i>No Description</i>'}</p>
      //           <div class='row'>
      //              <div class='col'> ${item.stargazers_count} Stars</div>
      //              <div class='col'>
      //                 <a href="${item.html_url}" target="_blank">
      //                    View on github
      //                 </a>
      //              </div>
      //           </div>
      //        </div>
      //     `
      //     }
      //     $('#repo-container').html(content);
      //  } else {
      //     $('#repo-container').html(`<p class='text-center'>Anime not found</p>`);
      //  }
    })
    .fail(function (err) {
       console.log(err)
    });
}

function favAnime(idAnime){
  $.ajax({
    method : 'POST',
    url : 'http://localhost:3000/anime',
    data : {id: idAnime},
    headers : {
      token: access_token
    }
  })
  .done((data)=>{
    console.log(data);
  })
  .fail((err)=>{
    console.log(err);
  })
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
  

  $('#input_search_anime').keyup(() => {
    setTimeout(searchAnime($('input_search_anime').val()))
  })
})