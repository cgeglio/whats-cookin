let body = document.querySelector('body');
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
let fullRecipeInfo = document.querySelector('.recipe-instructions');

window.addEventListener('load', createCards);
window.addEventListener('load', findTags);
window.addEventListener('load', generateUser);
filterBtn.addEventListener('click', findCheckedBoxes);
main.addEventListener('click', addToMyRecipes);
savedRecipesBtn.addEventListener('click', showSavedRecipes);
allRecipesBtn.addEventListener('click', showAllRecipes);
searchBtn.addEventListener('click', searchRecipes);
pantryBtn.addEventListener('click', toggleMenu);


function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + '...';
    }
    let cardHtml = `
      <div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
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
    let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}-checkbox">
                  <label for="${tag}-checkbox">${capitalize(tag)}</label></li>`;
    tagList.insertAdjacentHTML('beforeend', tagHtml);
  });
}

function capitalize(words) {
  return words.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
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
  showAllRecipes();
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
  // console.log(event.target);
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    };
  } else if (event.target.id === 'exit-recipe-btn') {
    exitRecipe();
  // } else if (event.target.parentNode.className === "card-photo-container" || event.target.parentNode.className === "recipe-card") {
  } else if (isDescendant(event.target.closest('.recipe-card'), event.target)) {
    openRecipeInfo(event);
  }
}

function isDescendant(parent, child) {
  console.log(parent);
  let node = child;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function openRecipeInfo(event) {
  fullRecipeInfo.style.display = 'inline';
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  generateRecipeTitle(recipe, generateIngredients(recipe));
  addRecipeImage(recipe);
  generateInstructions(recipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", '<section id="overlay"></div>');
}

function generateRecipeTitle(recipe, ingredients) {
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${recipe.name}</h3>
    <h4>Recipe Ingredients</h4>
    <p>${ingredients}</p>`
  fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
}

function addRecipeImage(recipe) {
  console.log(document.getElementById('recipe-title'));
  document.getElementById('recipe-title').style.backgroundImage = `url(${recipe.image})`;
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    return `${capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(', ');
}

function generateInstructions(recipe) {
  let instructionsList = '';
  let instructions = recipe.instructions.map(i => {
    return i.instruction
  });
  instructions.forEach(i => {
    instructionsList += `
      <li>${i}</li>
      `
  });
  fullRecipeInfo.insertAdjacentHTML("beforeend", '<h4>Instructions</h4>');
  fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  while(fullRecipeInfo.firstChild && fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = 'none';
  document.getElementById('overlay').remove();
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
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

function displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" id="${ingredient.name}-checkbox">
      <label for="${ingredient.name}-checkbox">${ingredient.name}, ${ingredient.count}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML('beforeend', ingredientHtml);
  });
};

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display= "block";
  } else {
    menuDropdown.style.display= "none";
  }
};
