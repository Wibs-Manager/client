let access_token
let arrData
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
      arrData = data
      let content = ``
      for (let i = 0; i < 10; i++) {
         let item = data[i];
         content += `
            <div class='repo-item p-2 border-bottom'>
              <img src='${item.image_url}'>
               <p class='font-weight-bold' onClick="description(${item.mal_id})">${item.title}</p>
               <div class='row'>
                  <div class='col'> ${item.score} Score</div>
                  <div class='col'>
                    <a href="#boxes" onClick="favAnime(${item.mal_id})"> Fav this anime</a>
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
    })
    .fail(function (err) {
       console.log(err)
    });
}

function tombolSearch(){
  $('#search-button').click(event =>{
    $('#jikan-topten').empty('')
    console.log(event);
    console.log($('#search-result').val());
    $.ajax({
      method : 'GET',
      url : `http://localhost:3000/anime/search/${$('#search-result').val()}`,
    beforeSend: function () {
       $('#repo-container').html(`<div class="d-flex justify-content-center p-3">
       <div class="spinner-border" role="status">
         <span class="sr-only">Loading...</span>
       </div>
     </div>`);
    }
 })
    .done(function (data) {
      console.log(data);
      arrData = data
      $('#jikan-topten').empty('')
      let content = ``
      for (let i = 0; i < 10; i++) {
         let item = data.results[i];
         content += `
            <div class='repo-item p-2 border-bottom'>
              <img src='${item.image_url}'>
              <p class='font-weight-bold' onClick="description(${item.mal_id})">${item.title}</p>
               <div class='row'>
                  <div class='col'> ${item.score} Score</div>
                  <div class='col'>
                    <a href="#boxes" onClick="favAnime(${item.mal_id})"> Fav this anime</a>
                  </div>
               </div>
            </div>
         `
      }
      $('#jikan-topten').html(content);
    })
    .fail(function (err) {
       console.log(err)
    });

    
  })
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

function getManga() {
  // const token = localStorage.getItem('token')
  $('.description-content').html('')
  $('#jikan-topten').html('')
  $.ajax({
    method : 'GET',
    url : 'http://localhost:3000/manga',
    // headers : {
    //   token
    // },
    beforeSend: function () {
      $('#repo-container').html(`<div class="d-flex justify-content-center p-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`);
   }
  })
    .done( data => {
      console.log(data);
      arrData = data
      let content = ``
      for (let i = 0; i < 10; i++) {
         let item = data.data[i];
         console.log(item, 'iniiiiii dataaa ke ', i);
         
         content += `
            <div class='repo-item p-2 border-bottom'>
             <img src='${item.attributes.posterImage.small}'>
               <p class='font-weight-bold' onClick="description(${item.id})">${item.attributes.titles.en}</p>
               <div class='row'>
                  <div class='col'> ${item.attributes.favoritesCount} Favorite count</div>
                  <div class='col'>
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

function description(id){
  console.log(id);
  console.log(arrData);
  $('.description-content').html('')
  $.ajax({
    method : 'GET',
    url : `http://localhost:3000/anime/${id}`,
    beforeSend: function () {
      $('#repo-container').html(`<div class="d-flex justify-content-center p-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`);
   }
  })
    .done( data => {
      console.log(data, 'ini data dari controller');
      let content =`
         <div class='border' style='border-radius: 4px; overflow: auto; max-height: 100vh; padding: 2rem;'>
         <h3>
            ${data.title}
         </h3>
         <br>
         <br>
         <h4> Synopsis : </h4>
         <p>
         ${data.synopsis}
         </p>
      </div>
         `
      $('.description-content').html(content);
    })
    .fail(err => {
      console.log(err);
    })
}

function showCats(){
  $.ajax({
    method : 'GET',
    url : 'http://localhost:3000/cat'
  })
    .done(content => {
      console.log(content);
      $('.description-content').append(`
      <img src='${content}' style="max-width:100%;"></img>
      `)
    })
    .fail(err => {
      console.log(err);
    })
}

$(document).ready(function(){
  
  const token = localStorage.getItem('token')
  if(token) {
    togglePage(1)
    toggleLogin(0)
    getAnime()
    showCats()
  } else {
    toggleLogin(1)
    togglePage(0)
  }
  
  tombolSearch()

 
})