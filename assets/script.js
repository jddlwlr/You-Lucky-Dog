//Event Listener variables
var searchFormEl = document.querySelector('#dog-form');
var zipcodeInputEl = document.querySelector('#zipcode');
var searchGenderEl = document.querySelector('#search-gender');
var searchSizeEl = document.querySelector('#search-size');
var searchAgeEl = document.querySelector('#search-age');


var dogNameEl = document.querySelector('#dog-name');
var dogPhotoEl = document.querySelector('#dog-photo');
var dogAgeEl = document.querySelector('#dog-age');
var thisDogBreedEl = document.querySelector('#this-dog-breed');
var dogGenderEl = document.querySelector('#dog-gender');
var dogSizeEl = document.querySelector('#dog-size');
var orgUrlEl = document.querySelector('#org-Url');
var leftArrowEl = document.querySelector('#leftArrow');
var rightArrowEl = document.querySelector('#rightArrow');
var dogWeightEl = document.querySelector('#dog-weight');

//Additional variables
var petFinderResults;
var petArrayPosition = 0;

//Submit Form event handler
var formSubmitHandler = function (event) {
  event.preventDefault();

  var zipcode = zipcodeInputEl.value.trim();
  var searchAge = searchAgeEl.value.trim();
  var searchGender = searchGenderEl.value.trim();
  var searchSize = searchSizeEl.value.trim();

  if(searchAge){
    searchAge = "&age=" + searchAgeEl.value.trim();
  }
  else{
searchAge='';
  }

  if(searchGender){
    searchGender = "&gender=" + searchGenderEl.value.trim();
  }
  else{
searchGender='';
  }

  if(searchSize){
    searchSize = "&size=" + searchSizeEl.value.trim();
  }
  else{
searchSize='';
  }



  if (zipcode) {
      getToken(zipcode,searchAge,searchSize,searchGender);
      zipcodeInputEl.value = '';

    
  } else {

    alert('Please enter a zip code');
  }
};

//Create initial authorization call to PetFinder

var getToken = function (zipcode,searchAge,searchSize,searchGender) {
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
          getPetResults(data, zipcode, searchAge, searchSize, searchGender);
        });
      } else {
        alert('Unauthorized');
      }
    })

};

var getPetResults = function (results, zipcode, searchAge, searchSize, searchGender){

var petFinderURL ='https://api.petfinder.com/v2/animals?type=dog&status=adoptable'+searchAge+searchSize+searchGender+'&location='+ zipcode + '&sort=-distance';
var bearer = results.token_type + ' ' + results.access_token;

fetch(petFinderURL,{ 
  headers: {
     'Authorization': bearer,
  }
})

.then(function (response) {
  if (response.ok) {
    response.json().then(function (data) {
      petFinderResults = data;
      showPetResults(petFinderResults);
      var currentBreed = data.animals[petArrayPosition].breeds.primary;
      dogApi(currentBreed);
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
  if (results.animals[petArrayPosition].photos.length === 0){
    dogPhotoUrl = '';
  }

  else{
    dogPhotoUrl = results.animals[petArrayPosition].photos[0].medium;
  }

  dogNameEl.textContent = 'Meet ' + results.animals[petArrayPosition].name + "!";
  dogPhotoEl.setAttribute("src",dogPhotoUrl);
  dogPhotoEl.setAttribute("class", "show");
  thisDogBreedEl.textContent = 'Breed: ' + results.animals[petArrayPosition].breeds.primary;
  dogAgeEl.textContent = 'Age: ' + results.animals[petArrayPosition].age;
  dogGenderEl.textContent = 'Gender: ' + results.animals[petArrayPosition].gender;
  dogSizeEl.textContent = 'Size: ' + results.animals[petArrayPosition].size;
  orgUrlEl.setAttribute("href", orgUrl);
  orgUrlEl.setAttribute("class", "");
  orgUrlEl.innerHTML = '<button class="button is-warning">Visit the About page for this dog</button>';

  arrowHandler();

};



// Dog API 

var dogApi = function(currentBreed){

// var currentBreed = data.animals[0].breeds.primary;
var dogUrl = 'https://api.thedogapi.com/v1/breeds/search?q='+ currentBreed + '&api_key=4967806f-5944-4473-9348-b6101abfe209';
var breedData = document.getElementById('breed-data');

fetch(dogUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data)
  

  //var breedTemperment = document;

  dogWeightEl.textContent = 'Weight: ' + data[0].weight.imperial + 'lbs';

    document.getElementById('dog-breed').textContent = data[0].name + '\'s';
  
});
}


//Display Dogs on left arrow clicks
var leftArrowHandler = function(){
petArrayPosition--;
showPetResults(petFinderResults);
var updatedBreedLeft = petFinderResults.animals[petArrayPosition].breeds.primary;
dogApi(updatedBreedLeft);
}


//Display Dogs on left arrow clicks
var rightArrowHandler = function(){
  petArrayPosition++;
  showPetResults(petFinderResults);
  var updatedBreedRight = petFinderResults.animals[petArrayPosition].breeds.primary;
  dogApi(updatedBreedRight);
  
  }

  //Controls whether the arrows are shown
var arrowHandler = function(){
if (petArrayPosition > 0){
  leftArrowEl.setAttribute("class", "show button is-warning");
}
else{
  leftArrowEl.setAttribute("class", "no-show");
}

if (petArrayPosition < petFinderResults.animals.length-1){
  rightArrowEl.setAttribute("class", "show button is-warning");
}
else{
  rightArrowEl.setAttribute("class", "no-show");
}

}

//Button and Form handlers
searchFormEl.addEventListener('submit', formSubmitHandler);
leftArrowEl.addEventListener('click', leftArrowHandler);
rightArrowEl.addEventListener('click', rightArrowHandler);