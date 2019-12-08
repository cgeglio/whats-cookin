let main = document.querySelector('main');
let tagList = document.querySelector('.tag-list');
let recipes = [];
let filterBtn = document.querySelector(".filter-btn");

window.addEventListener("load", createCards);
window.addEventListener("load", findTags);
window.addEventListener("load", generateUser);
filterBtn.addEventListener("click", findCheckedBoxes);


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
          <img src=${recipeInfo.image} class="card-photo-preview">
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled-apple-icon" class="card-apple-icon">
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
    let tagHtml = `<li><input type="checkbox" class="checked-tag"> ${tag}</li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
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
    let results = recipes.filter(recipe => {
      return recipe.tags.includes(tag.parentNode.innerText.trim());
    });
    results.forEach(result => {
      filteredResults.push(result);
    });
  });
  hideUnselectedRecipes(filteredResults);
}

function hideUnselectedRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

function generateUser() {
  let user = new User(users[Math.floor(Math.random()*users.length)]);
  let firstName = user.name.split(' ')[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  main.insertAdjacentHTML("afterbegin", welcomeMsg);
}
