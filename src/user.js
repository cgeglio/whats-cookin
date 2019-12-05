class User {
  constructor() {
    this.favoriteRecipes = [];
    this.recipesToCook = [];
    // this.filteredRecipes;
  }
  saveRecipe(recipe) {
    this.favoriteRecipes.push(recipe);
  }
  decideToCook(recipe) {
    this.recipesToCook.push(recipe);
  }
  filterRecipes(type) {
    return this.favoriteRecipes.filter(recipe => recipe.type.includes(type));
  }
  searchForRecipe(keyword) {
    return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
  }
}

module.exports = User;
