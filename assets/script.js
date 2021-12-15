//Dog search and results Event Listener variables
var searchFormEl = document.querySelector('#dog-form');
var zipcodeInputEl = document.querySelector('#zipcode');
var searchGenderEl = document.querySelector('#search-gender');
var searchSizeEl = document.querySelector('#search-size');
var searchAgeEl = document.querySelector('#search-age');
var aboutThisDogEl = document.querySelector('#about-this-dog');
var dogDescriptionEl = document.querySelector('#dog-description');
var dogNameEl = document.querySelector('#dog-name');
var dogPhotoEl = document.querySelector('#dog-photo');
var dogAgeEl = document.querySelector('#dog-age');
var thisDogBreedEl = document.querySelector('#this-dog-breed');
var dogGenderEl = document.querySelector('#dog-gender');
var dogSizeEl = document.querySelector('#dog-size');
var orgUrlEl = document.querySelector('#org-Url');
var leftArrowEl = document.querySelector('#leftArrow');
var rightArrowEl = document.querySelector('#rightArrow');

//Photo Modal event listeners
var modalPhotoEl = document.querySelector('#modal-photo');
var closeModalEl = document.querySelector('#close-modal');
var photoModalContainerEl = document.querySelector('#photo-modal-container');

//Page load Alert message modals
var closeAlertModalEl = document.querySelector('#close-alert-modal');
var alertModalEl = document.querySelector('#alert-modal');

//Zipcode message modals
var closeZipcodeModalEl = document.querySelector('#close-zipcode-modal');
var zipcodeModalEl = document.querySelector('#zipcode-modal');

//Contact modal
var contactBtnEl = document.querySelector('#contact-btn');
var contactModalEl = document.querySelector('#contact-modal');
var closeContactModalEl = document.querySelector('#close-contact-modal');
var cancelContactEl = document.querySelector('#contact-cancel');
var submitEmailEl = document.querySelector('#submit-email');
var contactEmailEl = document.querySelector('#contact-email');
var subjectEmailEl = document.querySelector('#subject-email');
var emailContentEl = document.querySelector('#email-content');

//Favorites event listeners and variables
var favoriteBtnEl = document.querySelector('#favorite-btn');
var favorites= [];

//Formatting event listeners to help dynamically show and hide structures
var breedContainerEl = document.querySelector('#breedContainer');
var petSlideshowEl = document.querySelector('#petSlideshow');
var breedContainer2El = document.querySelector('#breedContainer2');
var column1El = document.querySelector('#column1');
var column2El = document.querySelector('#column2');
var column3El = document.querySelector('#column3');

//Dog API result event listeners
var breedWeightEl = document.querySelector('#breed-weight');
var breedUseEl = document.querySelector('#breed-use');
var breedAgeEl = document.querySelector('#breed-age');
var breedTempermentEl = document.querySelector('#breed-temperment');

//Additional helper variables
var petFinderResults;
var petArrayPosition = 0;
var dogPhotoUrl = '';
var dogPhotoLargeUrl = ''
var contactEmail='';
var emailSubject='';
var emailUrl='';
var emailContent='';
var orgUrl='';
var dogNameHelper=''

//Submit Form event handler
//Takes in the values a user enters in the dog search and makes the first Petfinder API call
var formSubmitHandler = function (event) {
  event.preventDefault();

  //updates variables to the user's input
  var zipcode = zipcodeInputEl.value.trim();
  var searchAge = searchAgeEl.value.trim();
  var searchGender = searchGenderEl.value.trim();
  var searchSize = searchSizeEl.value.trim();

  //if the user enters a criteria for age, then the searchAge will be formatted in a Query Parameter format to be accepted by the API call, otherwise it will remain empty
  if(searchAge){
    searchAge = "&age=" + searchAgeEl.value.trim();
  }
  else{
searchAge='';
  }

    //if the user enters a criteria for gender, then the searchGender will be formatted in a Query Parameter format to be accepted by the API call, otherwise it will remain empty
  if(searchGender){
    searchGender = "&gender=" + searchGenderEl.value.trim();
  }
  else{
searchGender='';
  }


    //if the user enters a criteria for size, then the SearchSize will be formatted in a Query Parameter format to be accepted by the API call, otherwise it will remain empty
  if(searchSize){
    searchSize = "&size=" + searchSizeEl.value.trim();
  }
  else{
searchSize='';
  }


//If the user enters a zip code the the first call to the Petfinder API is made, including the user's search input as parameters.  Otherwise, the user is prompted to enter a zip code
  if (zipcode) {
      getToken(zipcode,searchAge,searchSize,searchGender);
      zipcodeInputEl.value = '';

    
  } else {

    zipcodeModalHandler();
  }
};

//Create initial authorization call to PetFinder passing the user's search criteria to be used at a later time

var getToken = function (zipcode,searchAge,searchSize,searchGender) {
  var apiTokenUrl = 'https://api.petfinder.com/v2/oauth2/token';
  
  //This post call requests an authentication token which will be used in the second Petfinder call.  This is required to get results
  fetch(apiTokenUrl, {
    method:'POST',
    body: 'grant_type=client_credentials&client_id=GxKYrnyVF48Z4i8rOwDRcyoCtA3hpU1fsY7rFg2nUikNFY46eX&client_secret=9NJHpYc4dOdTMoUhrovPZ8b67crTmVopJOyJuBXY',
  
  	headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  //If the call is successful, then it triggers a second call to Petfinderapi to return pet results given our query parameters, otherwise the user will receive an error message
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getPetResults(data, zipcode, searchAge, searchSize, searchGender);
        });
      } else {
        alertModalHandler();
      }
    })

};


//This function will return pets in an area close to the user's indicated zipcode.  Pets returned optionally can be filtered by the user by age, size, and gender
var getPetResults = function (results, zipcode, searchAge, searchSize, searchGender){

var petFinderURL ='https://api.petfinder.com/v2/animals?type=dog&status=adoptable'+searchAge+searchSize+searchGender+'&location='+ zipcode + '&sort=-distance';
var bearer = results.token_type + ' ' + results.access_token;

//This is the api call to Petfinder using the previously granted authorization token
fetch(petFinderURL,{ 
  headers: {
     'Authorization': bearer,
  }
})

//If the call is successful and results are returned, the data is stored and results and displayed via the showPetResults(results) function.  Additionally, another call to a the Dog API is made
//Otherwise, if the call is unsuccessful, the user will receive an error message
.then(function (response) {
  if (response.ok) {
    response.json().then(function (data) {
      petFinderResults = data;
      showPetResults(petFinderResults);
      var currentBreed = data.animals[petArrayPosition].breeds.primary;
      dogApi(currentBreed);
    });
  } else {
    alertModalHandler();
  }
})
};

//Function for displaying Dog information
var showPetResults = function (results){

  //When dog results are returned, we are changing the visibility of the column container that the results will be stored to by updating the class attributes
  breedContainerEl.setAttribute("class", "notification is-warning");
  petSlideshowEl.setAttribute("class", "notification is-warning");
  breedContainer2El.setAttribute("class", "notification is-warning");
  column1El.setAttribute("class", "column");
  column2El.setAttribute("class", "column");
  column3El.setAttribute("class", "column");


//If for some reason, no dogs are returned in our call then the results page will be updated with 'No dogs found' and the function will be exited
  if (results.length === 0) {
    dogNameEl.textContent = 'No dogs found';
    return;
  }

  //Here we begin populating various variables that are used throughout the page with results from the PetFinder API
  orgUrl = results.animals[petArrayPosition].url;
  contactEmail = results.animals[petArrayPosition].contact.email;
  emailSubject = 'Inquiry for ' + results.animals[petArrayPosition].name + " ID: " + results.animals[petArrayPosition].id;

//If the dog has a contact email associated with it, then a button will appear for the dog result allowing for users to contact the organization
  if(results.animals[petArrayPosition].contact.email){
    contactBtnEl.setAttribute("class", "button is-primary show");

  }
  else{

    contactBtnEl.setAttribute("class", "button is-primary no-show");
  }

  //If the dog has a photo associated with it then it will be displayed on the page, otherwise a placeholder image will be shown
  if (results.animals[petArrayPosition].photos.length === 0){
    dogPhotoUrl = 'assets/images/paw.jpg';
    dogPhotoLargeUrl = 'assets/images/paw.png';
  }

  else{
    dogPhotoUrl = results.animals[petArrayPosition].photos[0].medium;
    dogPhotoLargeUrl = results.animals[petArrayPosition].photos[0].large;
  }

  //Here we begin setting values to page structure based on the results from PetFinder API
  aboutThisDogEl.textContent ='About ' + results.animals[petArrayPosition].name;
  dogNameHelper= results.animals[petArrayPosition].name + '!';
  dogNameEl.textContent = 'Meet ' + results.animals[petArrayPosition].name + "!";
  dogPhotoEl.setAttribute("src",dogPhotoUrl);
  dogPhotoEl.setAttribute("class", "show");
  thisDogBreedEl.textContent = 'Breed: ' + results.animals[petArrayPosition].breeds.primary;
  dogAgeEl.textContent = 'Age: ' + results.animals[petArrayPosition].age;
  dogGenderEl.textContent = 'Gender: ' + results.animals[petArrayPosition].gender;
  dogSizeEl.textContent = 'Size: ' + results.animals[petArrayPosition].size;
  dogDescriptionEl.textContent = 'Description: ' + results.animals[petArrayPosition].description;


  orgUrlEl.setAttribute("href", orgUrl);
  orgUrlEl.setAttribute("class", "");
  orgUrlEl.innerHTML = '<button class="button is-primary"> Profile page for ' + results.animals[petArrayPosition].name + '! </button>';
  contactBtnEl.innerHTML = 'Inquire about '+ results.animals[petArrayPosition].name + '!';


  contactEmailEl.textContent = 'Email: ' + contactEmail;
  subjectEmailEl.textContent = 'Subject: ' + emailSubject;
  submitEmailEl.setAttribute("href", emailUrl);

//After the results are properly rendered, we need to call an additional function to show the appropriate arrow toggles based on the dog's position in the Results Array
  arrowHandler();

};



// Function for calling the Dog API to retrieve information about the current breed displayed on the page

var dogApi = function(currentBreed){
//The API url we use include the Breed of the current dog displayed on the search results page
var dogUrl = 'https://api.thedogapi.com/v1/breeds/search?q='+ currentBreed + '&api_key=4967806f-5944-4473-9348-b6101abfe209';


fetch(dogUrl)
.then(function (response) {
  return response.json();

})

//if the call to the Dog API does not contain information, then the column containing breed information will show 'No Breed information found'
.then(function (data) {
  if (data.length === 0) {
    document.getElementById('dog-breed').textContent = 'No breed information found';
    breedWeightEl.textContent = '';
  breedUseEl.textContent = ''
  breedAgeEl.textContent = '';
  breedTempermentEl.textContent = '';
    return;
  }

//Here we are capturing the results from the Dog API and posting them to the Breed information container
  breedWeightEl.textContent = 'Weight range: ' + data[0].weight.imperial + 'lbs';
  breedUseEl.textContent = 'Bred For: ' + data[0].bred_for;
  breedAgeEl.textContent = 'Average Lifespan: ' + data[0].life_span;
  breedTempermentEl.textContent = 'Temperament: ' + data[0].temperament;

  document.getElementById('dog-breed').textContent = 'Information about ' + data[0].name + 's';
  
});
}



//This function updates the dog shown when a user clicks on the left arrow
var leftArrowHandler = function(){
petArrayPosition--;
showPetResults(petFinderResults);
var updatedBreedLeft = petFinderResults.animals[petArrayPosition].breeds.primary;
dogApi(updatedBreedLeft);
}

//This function updates the dog shown when a user clicks on the right arrow
var rightArrowHandler = function(){
  petArrayPosition++;
  showPetResults(petFinderResults);
  var updatedBreedRight = petFinderResults.animals[petArrayPosition].breeds.primary;
  dogApi(updatedBreedRight);
  
  }

  //Controls whether the arrows are shown, for example if we are view the very first Dog in the search result then we will only see the right arrow.  If we are viewing the last dog we will only see the left arrow
  //Any dog in the middle of the search will show both arrows
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

//When a user clicks on a dog's image it will pop out the photo of dog into Modal and show a slightly larger photo as well 
var imageHandler = function(){
  modalPhotoEl.setAttribute("src",dogPhotoLargeUrl);
  photoModalContainerEl.setAttribute("class","modal is-active")

}

//For any of the Modals in the page, if the user clicks on the X in the top corner to close, then the modal will become 'inactive' on the page
var closeModalHandler = function(){
  if(photoModalContainerEl.getClass = 'modal is-active'){
    photoModalContainerEl.setAttribute("class","modal")
  }
  if(alertModalEl.getClass = 'modal is-active'){
    alertModalEl.setAttribute("class","modal")
  }

  if(zipcodeModalEl.getClass = 'modal is-active'){
    zipcodeModalEl.setAttribute("class","modal")
  }
  if(contactModalEl.getClass = 'modal is-active'){
    contactModalEl.setAttribute("class","modal")
  }


else{return;}
}

//Activating the API alert modal when there is an API connection error
var alertModalHandler = function(){
  alertModalEl.setAttribute("class","modal is-active")

}

//Activating the Zipcode alert modal when the user does not enter a zip code
var zipcodeModalHandler = function(){
  zipcodeModalEl.setAttribute("class","modal is-active")

}

//Activating the Contact modal when a user clicks the button to reach out to an organization about their dog
var contactModalHandler = function(){
  contactModalEl.setAttribute("class","modal is-active")


}
//This function updates the mailto information to include the proper TO email, subject, and message body when the user's mailbox is opened to send a message 
var emailContentHandler = function(){

 emailContent = emailContentEl.value;
  emailUrl = 'mailto:'+contactEmail+ '?subject=' + emailSubject + '&body='+emailContent;
  submitEmailEl.setAttribute("href", emailUrl);

}




//This function controls the dog photo slide show


$("#dogFamilies > div:gt(0)").hide();

setInterval(function() { 
  $('#dogFamilies > div:first')
  .fadeOut(1000)
  .next()
  .fadeIn(1000)
  .end()
  .appendTo('#dogFamilies');
}, 3000)

//button to scroll back to the top
var topButton = document.getElementById("topBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 1500) {
  topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// hamburger menu toggle functionality

(function () {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.querySelector('#' + burger.dataset.target);
  burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
  });
})();

//Handler for saving a favorite dog to the favorites array and subsequently local storage when a user clicks the heart button
var saveFavoriteHandler = function(){

  var favoriteDog = {
    name: dogNameHelper,
    photo: dogPhotoUrl,
    orgUrl: orgUrl,
  }

  favorites.push(favoriteDog);
  localStorage.setItem("dogs", JSON.stringify(favorites));



}

//when the page loads, it captures the currently stored favorites from local storage
function init() {
  // Get stored favorites from localStorage
  var storedDogs = JSON.parse(localStorage.getItem("dogs"));

  // If dogs were retrieved from localStorage, update the favorites array to the value from local storage
  if (storedDogs !== null) {
    favorites = storedDogs;
  }

}

//Button and Form handlers
searchFormEl.addEventListener('submit', formSubmitHandler);
leftArrowEl.addEventListener('click', leftArrowHandler);
rightArrowEl.addEventListener('click', rightArrowHandler);
dogPhotoEl.addEventListener('click', imageHandler);
closeModalEl.addEventListener('click', closeModalHandler);
closeAlertModalEl.addEventListener('click', closeModalHandler);
closeZipcodeModalEl.addEventListener('click', closeModalHandler);
contactBtnEl.addEventListener('click', contactModalHandler);
closeContactModalEl.addEventListener('click', closeModalHandler);
cancelContactEl.addEventListener('click', closeModalHandler);
emailContentEl.addEventListener('input', emailContentHandler);
favoriteBtnEl.addEventListener('click', saveFavoriteHandler);

init();