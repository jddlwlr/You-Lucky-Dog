var favoriteDogs = [];

function init() {
    // Get stored favorites from localStorage
    var storedDogs = JSON.parse(localStorage.getItem("dogs"));
  
    // If cities were retrieved from localStorage, update the favorites array to it
    if (storedDogs !== null) {
      favoriteDogs = storedDogs;
    }
  
    // This is a helper function that will render saved dogs to the page
    renderSavedDogs();
  }


  //Display saved dog cards
  function renderSavedDogs(){
    for(i=0;i<favoriteDogs.length;i++){
//create structure in DOM
        
    }

  }

  init();

