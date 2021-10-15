import React, { KeyboardEvent, useEffect, useState, MouseEvent } from 'react';
import { MdCancel } from 'react-icons/md';
import { default as levenshtein } from 'damerau-levenshtein';
import './TagInput.scss';

function TagInputTag(props: { tag: string; onRemove: () => void }) {
  return (
    <div className="tag-input-tag">
      <span>{props.tag}</span>
      <div onClick={() => props.onRemove()}>
        <MdCancel />
      </div>
    </div>
  );
}

export default function TagInput(props: {
  selectedTags: string[];
  availableTags: string[];
  onToggleTag: (tag: string) => void;
  onAction: () => void;
}) {
  let [inputValue, setInputValue] = useState('');
  let [selectedAutoComplete, setSelectedAutoComplete] = useState(0);
  let [autoComplete, setAutoComplete] = useState(
    [] as {
      tag: string;
      start: number;
      end: number;
      match: number;
      selected: boolean;
    }[]
  );

  useEffect(() => {
    setSelectedAutoComplete(0);
  }, [inputValue]);

  useEffect(() => {
    let lowerCaseSearch = inputValue.toLowerCase();
    if (lowerCaseSearch.length <= 0) {
      setAutoComplete([]);
    } else {
      let list = props.availableTags
        .map((tag) => {
          let lowerCaseTag = tag.toLowerCase();
          let index = lowerCaseTag.indexOf(lowerCaseSearch);

          return {
            tag: tag,
            start: index,
            end: index + lowerCaseSearch.length,
            match:
              index >= 0
                ? levenshtein(lowerCaseTag, lowerCaseSearch).similarity
                : 0,
            selected: false,
          };
        })
        .filter(
          (tag) => tag.match > 0 && !props.selectedTags.includes(tag.tag)
        );
      list.sort((a, b) => b.match - a.match);

      if (selectedAutoComplete < list.length) {
        list[selectedAutoComplete].selected = true;
      }

      setAutoComplete(list);
    }
  }, [
    inputValue,
    selectedAutoComplete,
    props.selectedTags,
    props.availableTags,
  ]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
      case 'Backspace':
        if (inputValue.length <= 0 && props.selectedTags.length > 0) {
          props.onToggleTag(props.selectedTags[props.selectedTags.length - 1]);
        }
        break;
      case 'Enter':
        if (selectedAutoComplete < autoComplete.length) {
          let tag = autoComplete[selectedAutoComplete].tag;
          props.onToggleTag(tag);
          setInputValue('');
        } else if (props.selectedTags.length > 0 && inputValue.length <= 0) {
          (e.target as HTMLInputElement).blur();
          props.onAction();
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (selectedAutoComplete > 0) {
          setSelectedAutoComplete(selectedAutoComplete - 1);
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (selectedAutoComplete < autoComplete.length - 1) {
          setSelectedAutoComplete(selectedAutoComplete + 1);
        }
        e.preventDefault();
        break;
    }
  };

  const onSelectTag = (tag: string) => {
    props.onToggleTag(tag);
    setInputValue('');
  };

  const onAction = (e: MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).blur();
    props.onAction();
  };

  let tags = props.selectedTags.map((tag) => (
    <TagInputTag key={tag} tag={tag} onRemove={() => props.onToggleTag(tag)} />
  ));
  let autoCompleteEntries = autoComplete.map((tag) => {
    let first = tag.tag.substring(0, tag.start);
    let second = tag.tag.substring(tag.start, tag.end);
    let third = tag.tag.substring(tag.end);

    return (
      <div
        key={tag.tag}
        onClick={() => onSelectTag(tag.tag)}
        className={tag.selected ? 'selected' : ''}
      >
        <span>{first}</span>
        <span style={{ fontWeight: 'bold' }}>{second}</span>
        <span>{third}</span>
      </div>
    );
  });

  return (
    <label htmlFor="tag-input" className="tag-input">
      <div
        className={
          'tag-input-group' +
          (autoCompleteEntries.length > 0 ? ' auto-complete-active' : '')
        }
      >
        <div className="tag-input-box">
          {tags}
          <input
            id="tag-input"
            name="tag-input"
            value={inputValue}
            onKeyDown={onKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button className="tag-input-action" onClick={onAction}>
          Rezept generieren
        </button>
      </div>

      <div className="tag-input-auto-complete">{autoCompleteEntries}</div>
    </label>
  );
}
