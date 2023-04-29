import React, { useEffect, useState } from 'react';
import { Recipe } from './Recipe';
import { IngredientWithUnits, RecipeOptions } from './types';
import { RecipeEditor } from './RecipeEditor';

export function AppV2() {
  let [ingredients, setIngredients] = useState([] as IngredientWithUnits[]);
  let [units, setUnits] = useState([] as string[]);
  let [recipeOptions, setRecipeOptions] = useState({
    ingredients: [],
    allow_optional_ingredients: false,
  } as RecipeOptions);
  let [activeRecipe, setActiveRecipe] = useState(null as RecipeOptions | null);

  useEffect(() => {
    (async () => {
      let request = await fetch('/api_v2/get_ingredients_with_units/');
      let json = await request.json();

      let newIngredients: IngredientWithUnits[] = [];
      for (let key of Object.keys(json)) {
        newIngredients.push({
          name: key,
          units: json[key],
        });
      }

      setIngredients(newIngredients);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      let request = await fetch('/api_v2/get_units/');
      let json = await request.json();
      setUnits(json);
    })();
  }, []);

  const clickButton = () => {
    if (recipeOptions !== activeRecipe) {
      setActiveRecipe(recipeOptions);
    }
  };

  return (
    <>
      <RecipeEditor
        ingredients={ingredients}
        units={units}
        recipeOptions={recipeOptions}
        setRecipeOptions={setRecipeOptions}
        onAction={clickButton}
      />
      <Recipe recipe={activeRecipe} onClose={() => setActiveRecipe(null)} />
    </>
  );
}
