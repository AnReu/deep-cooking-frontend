import React, { useEffect, useState } from 'react';
import './App.scss';
import Recipe from './Recipe';
import TagInput from './TagInput';

export default function App() {
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
    <>
      <div className="app-background"></div>
      <div className="app">
        <div className="app-container">
          <span className="app-title">Welcome to Deep Cooking!</span>
          <span className="app-subtitle">
            Gib ein was dir schmeckt und lass dir ein tolles Rezept generieren!
          </span>
          <TagInput
            selectedTags={selectedTags}
            availableTags={availableTags}
            onToggleTag={(tag) => toggleTag(tag, selectedTags, setSelectedTags)}
            onAction={clickButton}
          />
          <Recipe selectedTags={activeTags} onClose={() => setActiveTags([])} />
        </div>
      </div>
    </>
  );
}
