//Event Listener variables
var searchFormEl = document.querySelector('#dog-form');
var zipcodeInputEl = document.querySelector('#zipcode');

//Submit Form event handler
var formSubmitHandler = function (event) {
  event.preventDefault();

  var zipcode = zipcodeInputEl.value.trim();

  if (zipcode) {
      getToken(zipcode);
      zipcodeInputEl.value = '';

    
  } else {

    alert('Please enter a zip code');
  }
};

//Create initial authorization call to PetFinder

var getToken = function (zipcode) {
  var apiTokenUrl = 'https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=GxKYrnyVF48Z4i8rOwDRcyoCtA3hpU1fsY7rFg2nUikNFY46eX&client_secret=9NJHpYc4dOdTMoUhrovPZ8b67crTmVopJOyJuBXY';
  fetch(apiTokenUrl, {
    method:'POST',
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getPetResults(data, zipcode);
        });
      } else {
        alert('Unable to connect to Petfinder');
      }
    })

};

var getPetResults = function (results, zipcode){

var petFinderURL ='https://api.petfinder.com/v2/animals?type=dog&status=adoptable&location='+ zipcode;
var bearer = 'Bearer ' + results.access_token;

fetch(petFinderURL,{ 
  headers: {
     'Authorization': bearer,
  }
})

.then(function (response) {
  if (response.ok) {
    response.json().then(function (data) {
      showPetResults(data);
    });
  } else {
    alert('Unable to connect to Petfinder');
  }
})
};

var showPetResults = function (results){
  console.log(results);

};

searchFormEl.addEventListener('submit', formSubmitHandler);

// Dog API 
var dogUrl = 'https://api.thedogapi.com/v1/breeds/search?q=lab&api_key=4967806f-5944-4473-9348-b6101abfe209';
var breedData = document.getElementById('breed-data');

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



