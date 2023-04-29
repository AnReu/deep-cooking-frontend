import React, { useEffect, useState } from 'react';
import { Recipe } from './Recipe';
import { TagInput } from './TagInput';
import styled from 'styled-components';

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

export function AppV1() {
  let [availableTags, setAvailableTags] = useState([] as string[]);
  let [selectedTags, setSelectedTags] = useState([] as string[]);
  let [activeTags, setActiveTags] = useState([] as string[]);

  useEffect(() => {
    (async () => {
      let request = await fetch('/api/get_ingredients/');
      let json = await request.json();
      setAvailableTags(json);
    })();
  }, []);

  const toggleTag = (
    tag: string | string[],
    selectedTags: string[],
    setSelectedTags: (tags: string[]) => void
  ) => {
    let copy = selectedTags.slice();

    if (Array.isArray(tag)) {
      for (let t of tag) {
        let index = copy.indexOf(t);
        if (index >= 0) {
          copy.splice(index, 1);
        } else {
          copy.push(t);
        }
      }
    } else {
      let index = copy.indexOf(tag);
      if (index >= 0) {
        copy.splice(index, 1);
      } else {
        copy.push(tag);
      }
    }

    setSelectedTags(copy);
  };

  const clickButton = () => {
    if (selectedTags.length > 0 && selectedTags !== activeTags) {
      setActiveTags(selectedTags);
    }
  };

  return (
    <StyledAppContainer>
      <StyledAppTitle>Willkommen auf Deep Cooking!</StyledAppTitle>
      <StyledAppSubtitle>
        Gib alle Zutaten ein, die verwendet werden sollen, und lass dir ein
        tolles Rezept generieren!
      </StyledAppSubtitle>
      <TagInput
        selectedTags={selectedTags}
        availableTags={availableTags}
        onToggleTag={(tag) => toggleTag(tag, selectedTags, setSelectedTags)}
        onAction={clickButton}
      />
      <Recipe selectedTags={activeTags} onClose={() => setActiveTags([])} />
    </StyledAppContainer>
  );
}
