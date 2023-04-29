import React, { KeyboardEvent, useEffect, useState, MouseEvent } from 'react';
import { MdCancel, MdClear } from 'react-icons/md';
import { default as levenshtein } from 'damerau-levenshtein';
import styled from 'styled-components';

const StyledTagInput = styled.label`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    appearance: none;
    outline: none;
    border: none;
    background-color: var(--primary-background);
    font-size: 1rem;
    min-width: 0;
    flex: 1 1;
    margin: 0.5rem 0;
  }

  @media only screen and (max-width: 599px) {
    margin-bottom: 4.6rem;
  }
`;

const StyledTagInputGroup = styled.div`
  display: flex;

  @media only screen and (max-width: 599px) {
    flex-direction: column;

    &.auto-complete-active .tag-input-box {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  @media only screen and (min-width: 600px) {
    background-color: var(--primary-background);
    border: solid 1px var(--border-color);
    border-radius: 0.2rem;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    overflow: hidden;

    &:focus-within {
      outline: solid 2px var(--theme-color);
    }

    &.auto-complete-active {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
`;

const StyledTagInputBox = styled.div`
  position: relative;
  background-color: var(--primary-background);
  line-height: 1.8rem;
  padding: 0.4rem 1rem;
  padding-right: 2rem;
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: 599px) {
    border: solid 1px var(--border-color);
    border-radius: 0.2rem;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    &:focus-within {
      outline: solid 2px var(--theme-color);
    }
  }

  @media only screen and (min-width: 600px) {
    flex: 1 1 auto;
  }
`;

const StyledTagInputClear = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2rem;
  padding-right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }
`;

const StyledTagInputTag = styled.div`
  display: inline-block;
  position: relative;
  background-color: var(--tertiary-background);
  border: solid 1px var(--border-color);
  margin: 0.2rem;
  padding-right: 1rem;
  height: 1.8rem;
  border-radius: 0.9rem;

  span {
    padding-left: 0.7rem;
    padding-right: 0.9rem;
  }

  div {
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2rem;
    justify-content: center;
    align-items: center;
    opacity: 0.4;

    &:hover {
      opacity: 0.6;
    }
  }
`;

const StyledTagInputAction = styled.button`
  appearance: none;
  background-color: var(--primary-background);
  border: none;
  line-height: 1.8rem;
  padding: 0.4rem 1rem;

  @media only screen and (max-width: 599px) {
    margin-top: 0.4rem;
    border: solid 1px var(--border-color);
    border-radius: 0.2rem;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }

  @media only screen and (min-width: 600px) {
    border-left: solid 1px var(--border-color);
    flex: 0 0 auto;
    background-color: var(--tertiary-background);
  }
`;

const StyledTagInputAutoComplete = styled.div`
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  border-top: none;
  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);

  max-height: 20rem;
  overflow: scroll;
  position: absolute;
  left: 0;
  top: 100%;
  right: 0;
  z-index: 5;

  &:empty {
    display: none;
  }

  div {
    padding: 0.4rem 1rem;
    &:hover {
      background-color: var(--secondary-hover-background);
    }

    &.selected {
      background-color: var(--secondary-background);
      &:hover {
        background-color: var(--tertiary-hover-background);
      }
    }
  }
`;

function TagInputTag(props: { tag: string; onRemove: () => void }) {
  return (
    <StyledTagInputTag>
      <span>{props.tag}</span>
      <div onClick={() => props.onRemove()}>
        <MdCancel />
      </div>
    </StyledTagInputTag>
  );
}

export function TagInput(props: {
  selectedTags: string[];
  availableTags: string[];
  onToggleTag: (tag: string | string[]) => void;
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

  const onClear = () => {
    setInputValue('');
    props.onToggleTag(props.selectedTags);
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
    <StyledTagInput htmlFor="tag-input">
      <StyledTagInputGroup
        className={
          autoCompleteEntries.length > 0 ? ' auto-complete-active' : ''
        }
      >
        <StyledTagInputBox>
          {tags}
          <input
            id="tag-input"
            name="tag-input"
            value={inputValue}
            onKeyDown={onKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <StyledTagInputClear onClick={onClear}>
            <MdClear />
          </StyledTagInputClear>
        </StyledTagInputBox>
        <StyledTagInputAction onClick={onAction}>
          Rezept generieren
        </StyledTagInputAction>
      </StyledTagInputGroup>

      <StyledTagInputAutoComplete>
        {autoCompleteEntries}
      </StyledTagInputAutoComplete>
    </StyledTagInput>
  );
}
