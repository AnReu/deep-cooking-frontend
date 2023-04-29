import React, { useEffect, useState } from 'react';
import { MdClose, MdErrorOutline } from 'react-icons/md';
import styled from 'styled-components';
import { GeneratedRecipe, RecipeOptions } from './types';

const StyledRecipe = styled.div`
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  border-radius: 0.2rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;

  max-height: 50rem;
  opacity: 1;

  transition: max-height 0.4s, opacity 0.4s;

  &.hidden {
    max-height: 0;
    opacity: 0;
  }
`;

const StyledRecipeHeader = styled.div`
  position: relative;
  line-height: 3rem;
  padding: 0 1rem;
  background-color: var(--tertiary-background);

  div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.4;

    &:hover {
      opacity: 1;
    }
  }
`;

const StyledRecipeBody = styled.div`
  min-height: 10rem;
  padding: 1rem;
  white-space: pre-line;
`;

const StyledRecipeLoading = styled.div`
  min-height: 10rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    display: block;
    width: 6rem;
    height: 6rem;
    border: solid 0.3rem transparent;
    border-left-color: var(--theme-color);
    border-radius: 100%;
    animation: rotate 800ms infinite linear;
  }
`;

const StyledRecipeError = styled.div`
  min-height: 10rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 8rem;
  color: var(--error-color);
`;

export function Recipe(props: {
  recipe: RecipeOptions | null;
  onClose: () => void;
}) {
  let [content, setContent] = useState(null as GeneratedRecipe | null);
  let [isLoading, setIsLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.recipe && props.recipe.ingredients.length > 0) {
      setIsLoading(true);
      setHasError(false);
      (async () => {
        let params =
          props.recipe?.ingredients
            .filter((i) => i.ingredient.trim().length > 0)
            .map((i) => {
              return [
                i.amount.trim().length === 0 ? '0' : i.amount.replace(',', '.'),
                i.unit,
                i.ingredient,
                i.option,
              ].join('|');
            }) ?? [];

        try {
          let request = await fetch(
            '/api_v2/get_recipe/?ingredients=' + params.join('@@')
          );
          let recipe = await request.json();
          setContent(recipe);
          setIsLoading(false);
        } catch (e) {
          console.error(e);
          setContent(null);
          setIsLoading(false);
          setHasError(true);
        }
      })();
    }
  }, [props.recipe]);

  let body;
  if (isLoading) {
    body = (
      <StyledRecipeLoading>
        <span></span>
      </StyledRecipeLoading>
    );
  } else if (hasError) {
    body = (
      <StyledRecipeError>
        <MdErrorOutline />
      </StyledRecipeError>
    );
  } else {
    body = (
      <StyledRecipeBody>
        <div>{content?.ingredients}</div>
        <br />
        <div>{content?.preparation}</div>
      </StyledRecipeBody>
    );
  }

  return (
    <StyledRecipe
      className={
        !props.recipe || props.recipe.ingredients.length <= 0 ? ' hidden' : ''
      }
    >
      <StyledRecipeHeader>
        <span>{content?.name ?? 'Rezept'}</span>
        <div onClick={props.onClose}>
          <MdClose />
        </div>
      </StyledRecipeHeader>
      {body}
    </StyledRecipe>
  );
}
