//Event Listener variables
var searchFormEl = document.querySelector('#dog-form');
var zipcodeInputEl = document.querySelector('#zipcode');
var dogNameEl = document.querySelector('#dog-name');
var dogPhotoEl = document.querySelector('#dog-photo');
var dogAgeEl = document.querySelector('#dog-age');
var thisDogBreedEl = document.querySelector('#this-dog-breed');
var dogGenderEl = document.querySelector('#dog-gender');
var dogSizeEl = document.querySelector('#dog-size');
var orgUrlEl = document.querySelector('#org-Url');

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
  var apiTokenUrl = 'https://api.petfinder.com/v2/oauth2/token';
  fetch(apiTokenUrl, {
    method:'POST',
    body: 'grant_type=client_credentials&client_id=GxKYrnyVF48Z4i8rOwDRcyoCtA3hpU1fsY7rFg2nUikNFY46eX&client_secret=9NJHpYc4dOdTMoUhrovPZ8b67crTmVopJOyJuBXY',
  
  	headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getPetResults(data, zipcode);
        });
      } else {
        alert('Unauthorized');
      }
    })

};

var getPetResults = function (results, zipcode){

var petFinderURL ='https://api.petfinder.com/v2/animals?type=dog&status=adoptable&age=senior&location='+ zipcode;
var bearer = results.token_type + ' ' + results.access_token;

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

//Function for displaying Dog information
var showPetResults = function (results){
  console.log(results);
  if (results.length === 0) {
    dogNameEl.textContent = 'No dogs found';
    return;
  }
  var dogPhotoUrl = '';
  var orgUrl = results.animals[0].url;
  if (results.animals[0].photos.length === 0){
    dogPhotoUrl = '';
  }

  else{
    dogPhotoUrl = results.animals[0].photos[0].medium;
  }

  dogNameEl.textContent = 'Meet ' + results.animals[0].name + "!";
  dogPhotoEl.setAttribute("src",dogPhotoUrl);
  thisDogBreedEl.textContent = 'Breed: ' + results.animals[0].breeds.primary;
  dogAgeEl.textContent = 'Age: ' + results.animals[0].age;
  dogGenderEl.textContent = 'Gender: ' + results.animals[0].gender;
  dogSizeEl.textContent = 'Size: ' + results.animals[0].size;
  orgUrlEl.setAttribute("href", orgUrl);
  orgUrlEl.innerHTML = 'Visit the organization for this dog'


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



