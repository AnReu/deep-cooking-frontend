import React, { useEffect, useState } from 'react';
import { MdClose, MdErrorOutline } from 'react-icons/md';
import styled from 'styled-components';

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

export function Recipe(props: { selectedTags: string[]; onClose: () => void }) {
  let [content, setContent] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.selectedTags.length > 0) {
      setIsLoading(true);
      setHasError(false);
      (async () => {
        try {
          let request = await fetch(
            '/api/get_recipe/?ingredients=' + props.selectedTags.join('|')
          );
          let text = await request.json();
          setContent(text);
          setIsLoading(false);
        } catch (e) {
          console.error(e);
          setContent('');
          setIsLoading(false);
          setHasError(true);
        }
      })();
    }
  }, [props.selectedTags]);

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
    body = <StyledRecipeBody>{content}</StyledRecipeBody>;
  }

  return (
    <StyledRecipe className={props.selectedTags.length <= 0 ? ' hidden' : ''}>
      <StyledRecipeHeader>
        <span>Rezept</span>
        <div onClick={props.onClose}>
          <MdClose />
        </div>
      </StyledRecipeHeader>
      {body}
    </StyledRecipe>
  );
}
