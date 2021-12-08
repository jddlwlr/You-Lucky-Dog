var dogUrl = 'https://api.thedogapi.com/v1/breeds/search?q=lab&api_key=4967806f-5944-4473-9348-b6101abfe209';
var breedData = document.getElementById('breed-data');

// headers['x-api-key'] = "4967806f-5944-4473-9348-b6101abfe209"

fetch(dogUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data)
  
  var breedWeight = document.createElement('ul')
  var breedTemperment = document

  breedWeight.innerHTML = '<li>' + 'Weight: ' + data[0].weight.imperial + 'lbs'+'</li>';
 
breedData.append(breedWeight);

document.getElementById('dog-breed').textContent = data[0].name + '\'s';
  
});
// fetch(requestUrl)
// //   .then(response => response.JSON())
//   .then(console.log()); 
    
  
//   console.log(response);
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].url);
//       console.log(data[i].user.login);
//     }
//   });