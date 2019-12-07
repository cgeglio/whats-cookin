let main = document.querySelector('main');
let tagList = document.querySelector('.tag-list');
let recipes = [];

window.addEventListener("load", createCards);
window.addEventListener("load", findTags);

function createCards() {

  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      recipeInfo.name = recipeInfo.name.substring(0, 40) + '...';
    }
  let cardHtml = `
    <div class="recipe-card">
      <h3 maxlength="40">${recipeInfo.name}</h3>
      <div class="card-photo-preview">
        <img src=${recipeInfo.image} class="card-photo-preview">
      </div>
      <h4>${recipeInfo.tags[0]}</h4>
      <img src="../images/apple-logo-outline.png" alt="unfilled-apple-icon" class="card-apple-icon">
    </div>`
    main.insertAdjacentHTML("beforeend", cardHtml);
  });
};


function findTags() {
  let tags = [];
  let recipeTags = recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      };
    });
  });
  tags.sort();
  listTags(tags);
};

function listTags(allTags) {
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox"> ${tag}</li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
  });
};
