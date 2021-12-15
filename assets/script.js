//Event Listener variables
var searchFormEl = document.querySelector('#dog-form');
var zipcodeInputEl = document.querySelector('#zipcode');
var searchGenderEl = document.querySelector('#search-gender');
var searchSizeEl = document.querySelector('#search-size');
var searchAgeEl = document.querySelector('#search-age');
var aboutThisDogEl = document.querySelector('#about-this-dog');
var dogDescriptionEl = document.querySelector('#dog-description');

var dogNameEl = document.querySelector('#dog-name');
var dogPhotoEl = document.querySelector('#dog-photo');

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



var dogAgeEl = document.querySelector('#dog-age');
var thisDogBreedEl = document.querySelector('#this-dog-breed');
var dogGenderEl = document.querySelector('#dog-gender');
var dogSizeEl = document.querySelector('#dog-size');
var orgUrlEl = document.querySelector('#org-Url');
var leftArrowEl = document.querySelector('#leftArrow');
var rightArrowEl = document.querySelector('#rightArrow');
var breedContainerEl = document.querySelector('#breedContainer');
var petSlideshowEl = document.querySelector('#petSlideshow');
var breedContainer2El = document.querySelector('#breedContainer2');
var column1El = document.querySelector('#column1');
var column2El = document.querySelector('#column2');
var column3El = document.querySelector('#column3');

var breedWeightEl = document.querySelector('#breed-weight');
var breedUseEl = document.querySelector('#breed-use');
var breedAgeEl = document.querySelector('#breed-age');
var breedTempermentEl = document.querySelector('#breed-temperment');



//Additional variables
var petFinderResults;
var petArrayPosition = 0;
var dogPhotoUrl = '';
var dogPhotoLargeUrl = ''
var contactEmail='';
var emailSubject='';
var emailUrl='';
var emailContent='';

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

    zipcodeModalHandler();
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
        alertModalHandler();
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
    alertModalHandler();
  }
})
};

//Function for displaying Dog information
var showPetResults = function (results){
  console.log(results);

  breedContainerEl.setAttribute("class", "notification is-warning");
  petSlideshowEl.setAttribute("class", "notification is-warning");
  breedContainer2El.setAttribute("class", "notification is-warning");

  column1El.setAttribute("class", "column");
  column2El.setAttribute("class", "column");
  column3El.setAttribute("class", "column");


  if (results.length === 0) {
    dogNameEl.textContent = 'No dogs found';
    return;
  }

  var orgUrl = results.animals[petArrayPosition].url;
  contactEmail = results.animals[petArrayPosition].contact.email;
  emailSubject = 'Inquiry for ' + results.animals[petArrayPosition].name + " ID: " + results.animals[petArrayPosition].id;


  if(results.animals[petArrayPosition].contact.email){
    contactBtnEl.setAttribute("class", "button is-primary show");

  }
  else{
    console.log("exception caught");
    contactBtnEl.setAttribute("class", "button is-primary no-show");
  }

  if (results.animals[petArrayPosition].photos.length === 0){
    dogPhotoUrl = 'assets/images/no-image.png';
    dogPhotoLargeUrl = 'assets/images/no-image.png';
  }

  else{
    dogPhotoUrl = results.animals[petArrayPosition].photos[0].medium;
    dogPhotoLargeUrl = results.animals[petArrayPosition].photos[0].large;
  }
  aboutThisDogEl.textContent ='About ' + results.animals[petArrayPosition].name;
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
  orgUrlEl.innerHTML = '<button class="button is-primary"> About ' + results.animals[petArrayPosition].name + ' ! </button>';


  contactEmailEl.textContent = 'Email: ' + contactEmail;
  subjectEmailEl.textContent = 'Subject: ' + emailSubject;
  submitEmailEl.setAttribute("href", emailUrl);

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
  if (data.length === 0) {
    document.getElementById('dog-breed').textContent = 'No breed information found';
    breedWeightEl.textContent = '';
  breedUseEl.textContent = ''
  breedAgeEl.textContent = '';
  breedTempermentEl.textContent = '';
    return;
  }
  console.log(data);
  console.log(data[0].bred_for);

  breedWeightEl.textContent = 'Weight range: ' + data[0].weight.imperial + 'lbs';
  breedUseEl.textContent = 'Bred For: ' + data[0].bred_for;
  breedAgeEl.textContent = 'Average Lifespan: ' + data[0].life_span;
  breedTempermentEl.textContent = 'Temperament: ' + data[0].temperament;

  document.getElementById('dog-breed').textContent = 'Information about ' + data[0].name + 's';
  
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

//Pops out photo of dog into Modal
var imageHandler = function(){
  modalPhotoEl.setAttribute("src",dogPhotoLargeUrl);
  photoModalContainerEl.setAttribute("class","modal is-active")

}

//Closes a Modal
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

//API alert modals
var alertModalHandler = function(){
  alertModalEl.setAttribute("class","modal is-active")

}

//Zipcode alert modals
var zipcodeModalHandler = function(){
  zipcodeModalEl.setAttribute("class","modal is-active")

}

//Contact modals
var contactModalHandler = function(){
  contactModalEl.setAttribute("class","modal is-active")


}
//email content 
var emailContentHandler = function(){

 emailContent = emailContentEl.value;
  emailUrl = 'mailto:'+contactEmail+ '?subject=' + emailSubject + '&body='+emailContent;
  submitEmailEl.setAttribute("href", emailUrl);

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


//dog family slide show


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

// hamburger toggle functionality

(function () {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.querySelector('#' + burger.dataset.target);
  burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
  });
})();

