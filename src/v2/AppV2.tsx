import React, { useEffect, useState } from 'react';
import { Recipe } from './Recipe';
import styled from 'styled-components';
import { IngredientWithUnits, RecipeOptions } from './types';
import { RecipeEditor } from './RecipeEditor';

const StyledAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 96vw;
  max-width: 40rem;
  padding: 2rem 0;

  @media only screen and (min-width: 600px) {
    width: 80%;
  }
`;
const StyledAppTitle = styled.span`
  display: block;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 400;
  text-align: center;
  text-shadow: 0 0 3px white;
`;
const StyledAppSubtitle = styled.span`
  display: block;
  text-align: center;
  line-height: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 3px white;
`;

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
    <StyledAppContainer>
      <StyledAppTitle>Willkommen auf Deep Cooking!</StyledAppTitle>
      <StyledAppSubtitle>
        Gib alle Zutaten ein, die verwendet werden sollen, und lass dir ein
        tolles Rezept generieren!
      </StyledAppSubtitle>
      <RecipeEditor
        ingredients={ingredients}
        units={units}
        recipeOptions={recipeOptions}
        setRecipeOptions={setRecipeOptions}
        onAction={clickButton}
      />
      <Recipe recipe={activeRecipe} onClose={() => setActiveRecipe(null)} />
    </StyledAppContainer>
  );
}
