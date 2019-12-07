let main = document.querySelector('main');
let recipes = [];

window.addEventListener("load", createCards);
window.addEventListener("load", generateUser);

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

function generateUser() {
  let user = new User(users[Math.floor(Math.random()*users.length)]);
  let firstName = user.name.split(' ')[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  main.insertAdjacentHTML("afterbegin", welcomeMsg);
}
