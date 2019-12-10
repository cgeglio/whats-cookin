let main = document.querySelector('main');
let tagList = document.querySelector('.tag-list');
let recipes = [];
let filterBtn = document.querySelector('.filter-btn');
let savedRecipesBtn = document.querySelector('.saved-recipes-btn');
let allRecipesBtn = document.querySelector('.show-all-btn');
let user;
let searchInput = document.querySelector('.search-input');
let searchBtn = document.querySelector('.search-btn');
let pantryBtn = document.querySelector('.my-pantry-btn');
let menuOpen = false;


window.addEventListener('load', createCards);
window.addEventListener('load', findTags);
window.addEventListener('load', generateUser);
filterBtn.addEventListener('click', findCheckedBoxes);
main.addEventListener('click', addToMyRecipes);
savedRecipesBtn.addEventListener('click', showSavedRecipes);
allRecipesBtn.addEventListener('click', showAllRecipes);
searchBtn.addEventListener('click', searchRecipes);
pantryBtn.addEventListener("click", toggleMenu);


function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      recipeInfo.name = recipeInfo.name.substring(0, 40) + '...';
    }
    let cardHtml = `
      <div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${recipeInfo.name}</h3>
        <div class="card-photo-preview">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="recipe preview">
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
    main.insertAdjacentHTML("beforeend", cardHtml);
  });
}

function findTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  listTags(tags);
}

function listTags(allTags) {
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox" id="${tag}-checkbox">
                  <label for="${tag}-checkbox">${tag}</label></li>`;
    tagList.insertAdjacentHTML('beforeend', tagHtml);
  });
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll('.checked-tag');
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.parentNode.innerText.trim());
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  hideUnselectedRecipes(filteredResults);
}

function hideUnselectedRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = 'none';
  });
}

function generateUser() {
  user = new User(users[Math.floor(Math.random()*users.length)]);
  let firstName = user.name.split(' ')[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  main.insertAdjacentHTML("afterbegin", welcomeMsg);
  findPantryInfo();
}

function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    };
  };
}

function showSavedRecipes() {
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showMyRecipesBanner();
}

function showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "flex";
}

function showAllRecipes() {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
}

function showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
}

function searchRecipes() {
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.includes(searchInput.value);
  });
}

function findPantryInfo() {
  let pantryInfo = [];
  user.pantry.forEach(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    if(itemInfo && !pantryInfo.includes(itemInfo.name)) {
      pantryInfo.push(itemInfo.name);
    }
  });
  displayPantryInfo(pantryInfo);
}

function displayPantryInfo(pantry) {
  pantry.sort();
  pantry.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" id="${ingredient}-checkbox">
      <label for="${ingredient}-checkbox">${ingredient}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML('beforeend', ingredientHtml);
  });
};

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display= "flex";
  } else {
    menuDropdown.style.display= "none";
  }
};
