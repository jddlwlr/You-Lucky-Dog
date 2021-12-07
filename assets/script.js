var requestUrl = 'https://api.thedogapi.com/v1/breeds?breed_id=air&api_key=4967806f-5944-4473-9348-b6101abfe209';

fetch(requestUrl)
//   .then(response => response.JSON())
  .then(data => console.log(data)); 
    
  
//   console.log(response);
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].url);
//       console.log(data[i].user.login);
//     }
//   });