export type RecipeOptions = {
  ingredients: RecipeIngredient[];
  allow_optional_ingredients: boolean;
};

export type RecipeIngredientOption = '<exact>' | '<max>' | '<free>';

export type RecipeIngredient = {
  option: RecipeIngredientOption;
  ingredient: string;
  unit: string;
  amount: string;
};

export type GeneratedRecipe = {
  ingredients: string;
  name: string;
  preparation: string;
};

export type IngredientWithUnits = {
  name: string;
  units: string[];
};
