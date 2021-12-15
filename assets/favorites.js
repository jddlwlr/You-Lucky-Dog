favoriteDogsEl = document.querySelector('#favorite-dogs');
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
    favoriteDogsEl.innerHTML = '';
    for(i=0;i<favoriteDogs.length;i++){

        var column = document.createElement("div");
        column.setAttribute("data-index", i);
        column.setAttribute("class","column is-one-quarter")

        var cardContent = document.createElement("div");
        cardContent.setAttribute("data-index", i);
        cardContent.setAttribute("class","card-content")

        var title = document.createElement("p");
        title.setAttribute("class","subtitle");
        title.setAttribute("data-index", i);
        title.textContent = favoriteDogs[i].name;

        var image = document.createElement("img");
        image.setAttribute("src", favoriteDogs[i].photo);
        image.setAttribute("data-index", i);
        image.setAttribute("alt","Favorite Dog");

        var button = document.createElement("a");
        button.setAttribute("href",favoriteDogs[i].orgUrl);
        button.setAttribute("data-index", i);
        button.innerHTML = "<button class='button is-warning'> Profile page</button>";

        var close = document.createElement("button");
        close.setAttribute("class","button is-primary is-large is-rounded level-item");
        close.setAttribute("data-index", i);
        close.innerHTML = "<i class='far fa-window-close'></i>";

        cardContent.appendChild(close);
        cardContent.appendChild(title);
        cardContent.appendChild(image);
        cardContent.appendChild(button);
        column.appendChild(cardContent);
        favoriteDogsEl.appendChild(column);
    }

  }

//Remove favorites
var removeFavoriteHandler = function(event) {
    var element = event.target;

  
    // Checks if element is the close button
    if (element.matches("i") === true) {
      // Get its data-index value and remove the dog from the favorites
      var index = element.parentElement.getAttribute("data-index");
      console.log(index);
      favoriteDogs.splice(index, 1);
  
      // Store updated todos in localStorage, re-render the list
      
      localStorage.setItem("dogs", JSON.stringify(favoriteDogs));

      renderSavedDogs();
    }
  };

  init();

  favoriteDogsEl.addEventListener('click', removeFavoriteHandler);

