import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { BASE_URL } from '.';
import './Recipe.scss';

export default function Recipe(props: {
  selectedTags: string[];
  onClose: () => void;
}) {
  let [content, setContent] = useState('');
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.selectedTags.length > 0) {
      setIsLoading(true);
      (async () => {
        let request = await fetch(
          BASE_URL +
            '/api/get_recipe/?ingredients=' +
            props.selectedTags.join('|')
        );
        let text = await request.json();
        setContent(text);
        setIsLoading(false);
      })();
    }
  }, [props.selectedTags]);

  let body;
  if (isLoading) {
    body = (
      <div className="recipe-loading">
        <span></span>
      </div>
    );
  } else {
    body = <div className="recipe-body">{content}</div>;
  }

  return (
    <div
      className={'recipe' + (props.selectedTags.length <= 0 ? ' hidden' : '')}
    >
      <div className="recipe-header">
        <span>Rezept</span>
        <div onClick={props.onClose}>
          <MdClose />
        </div>
      </div>
      {body}
    </div>
  );
}
