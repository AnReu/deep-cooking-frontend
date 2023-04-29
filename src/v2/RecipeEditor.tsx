import {
  IngredientWithUnits,
  RecipeIngredient,
  RecipeIngredientOption,
  RecipeOptions,
} from './types';
import React, { KeyboardEvent } from 'react';
import { default as levenshtein } from 'damerau-levenshtein';
import styled from 'styled-components';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';

const StyledRow = styled.div`
  display: flex;
  position: relative;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.2rem;
  margin-bottom: 0.2rem;

  &:nth-child(even)::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.055;
    pointer-events: none;
  }

  & > label:first-of-type {
    flex-grow: 1;
  }

  & > label:not(:first-of-type) {
    width: 20%;
  }
`;

const StyledTagInputAutoComplete = styled.div`
  background-color: var(--primary-background);
  border-left: solid 1px var(--border-color);
  border-bottom: solid 1px var(--border-color);
  border-right: solid 1px var(--border-color);
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
    line-height: 1rem;

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

const StyledTagInput = styled.label`
  position: relative;
  display: block;
  z-index: 0;

  input {
    position: relative;
    appearance: none;
    outline: none;
    border: none;
    background-color: var(--primary-background);
    font-size: 1rem;
    min-width: 0;
    width: 100%;
    margin: 0.5rem 0;
    text-align: center;
  }

  &:focus-within {
    z-index: 1;
  }

  &:not(:focus-within) ${StyledTagInputAutoComplete} {
    display: none;
  }

  &:first-of-type > div:first-of-type {
    border-bottom-left-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
  }
`;

const StyledTagInputGroup = styled.div`
  display: flex;

  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  overflow: hidden;
  margin-right: -1px;

  &:focus-within {
    outline: solid 2px var(--theme-color);
  }
`;

const StyledTagInputAction = styled.button`
  appearance: none;
  padding: 0.4rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;

  border: solid 1px var(--border-color);
  flex: 0 0 auto;
  background-color: var(--tertiary-background);

  border-bottom-right-radius: 0.2rem;
  border-top-right-radius: 0.2rem;

  svg {
    opacity: 0.6;
  }

  &:hover {
    background-color: var(--tertiary-hover-background);
  }
`;

const StyledTagAction = styled.button`
  appearance: none;
  padding: 0.4rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  width: 100%;
  line-height: 2.4rem;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;

  border: solid 1px var(--border-color);
  flex: 0 0 auto;
  background-color: var(--secondary-background);

  border-radius: 0.2rem;

  &:hover {
    background-color: var(--secondary-hover-background);
  }
`;
function AutoCompleteInput(props: {
  value: string;
  setValue: (row: string) => void;
  options: string[];
  disableFilter?: boolean;
}) {
  let inputId = React.useId();
  let [selectedAutoComplete, setSelectedAutoComplete] = React.useState(0);
  let [autoComplete, setAutoComplete] = React.useState(
    [] as {
      tag: string;
      start: number;
      end: number;
      match: number;
      selected: boolean;
    }[]
  );

  React.useEffect(() => {
    setSelectedAutoComplete(0);
  }, [props.value]);

  React.useEffect(() => {
    let lowerCaseSearch = props.value.toLowerCase();
    if (lowerCaseSearch.length <= 0 && !props.disableFilter) {
      setAutoComplete([]);
    } else {
      let list = props.options
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
        .filter((tag) => tag.match > 0 || props.disableFilter);
      list.sort((a, b) => b.match - a.match);

      if (selectedAutoComplete < list.length) {
        list[selectedAutoComplete].selected = true;
      }

      setAutoComplete(list);
    }
  }, [props.value, props.options, selectedAutoComplete]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
      case 'Enter':
        if (selectedAutoComplete < autoComplete.length) {
          let tag = autoComplete[selectedAutoComplete].tag;
          props.setValue(tag);
        }
        e.preventDefault();
        break;
      case 'Tab':
        if (selectedAutoComplete < autoComplete.length) {
          let tag = autoComplete[selectedAutoComplete].tag;
          props.setValue(tag);
        }
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
    props.setValue(tag);
  };

  let autoCompleteEntries = autoComplete.map((tag) => {
    let first = tag.tag.substring(0, tag.start);
    let second = tag.tag.substring(tag.start, tag.end);
    let third = tag.tag.substring(tag.end);

    return (
      <div
        key={tag.tag}
        onMouseDown={() => onSelectTag(tag.tag)}
        className={tag.selected ? 'selected' : ''}
      >
        <span>{first}</span>
        <span style={{ fontWeight: 'bold' }}>{second}</span>
        <span>{third}</span>
      </div>
    );
  });

  return (
    <StyledTagInput htmlFor={inputId}>
      <StyledTagInputGroup
        className={
          autoCompleteEntries.length > 0 ? ' auto-complete-active' : ''
        }
      >
        <input
          id={inputId}
          name={inputId}
          value={props.value}
          onKeyDown={onKeyDown}
          autoComplete="off"
          onChange={(e) => props.setValue(e.target.value)}
        />
      </StyledTagInputGroup>

      <StyledTagInputAutoComplete>
        {autoCompleteEntries}
      </StyledTagInputAutoComplete>
    </StyledTagInput>
  );
}

function RecipeRow(props: {
  row: RecipeIngredient;
  setRow: (row: RecipeIngredient) => void;
  ingredients: IngredientWithUnits[];
  units: string[];
  mode: 'add' | 'edit';
  onAction: () => void;
}) {
  const setIngredient = (v: string) => {
    props.setRow({
      ...props.row,
      ingredient: v,
    });
  };
  const setOption = (v: string) => {
    props.setRow({
      ...props.row,
      option: v as RecipeIngredientOption,
    });
  };
  const setUnit = (v: string) => {
    props.setRow({
      ...props.row,
      unit: v,
    });
  };
  const setAmount = (v: string) => {
    props.setRow({
      ...props.row,
      amount: v,
    });
  };

  const foundIngredient =
    props.ingredients.find((i) => i.name === props.row.ingredient) ?? null;

  return (
    <StyledRow>
      <AutoCompleteInput
        value={props.row.ingredient}
        setValue={setIngredient}
        options={props.ingredients.map((i) => i.name)}
      />
      <AutoCompleteInput
        value={props.row.option}
        setValue={setOption}
        options={['<free>', '<exact>', '<max>']}
        disableFilter
      />
      <AutoCompleteInput
        value={props.row.unit}
        setValue={setUnit}
        options={foundIngredient?.units ?? props.units}
        disableFilter={!!foundIngredient}
      />
      <AutoCompleteInput
        value={props.row.amount}
        setValue={setAmount}
        options={[]}
      />
      <StyledTagInputAction onClick={props.onAction}>
        {props.mode === 'add' ? <MdAdd /> : <MdDeleteOutline />}
      </StyledTagInputAction>
    </StyledRow>
  );
}

export function RecipeEditor(props: {
  onAction: () => void;
  setRecipeOptions: (
    value: ((prevState: RecipeOptions) => RecipeOptions) | RecipeOptions
  ) => void;
  recipeOptions: RecipeOptions;
  ingredients: IngredientWithUnits[];
  units: string[];
}) {
  const [editRow, setEditRow] = React.useState({
    amount: '',
    unit: '',
    ingredient: '',
    option: '<free>',
  } as RecipeIngredient);
  const rows = props.recipeOptions.ingredients.map((row, index) => {
    const setRow = (row: RecipeIngredient) => {
      const ingredients = [...props.recipeOptions.ingredients];
      ingredients[index] = row;

      props.setRecipeOptions({
        ingredients: ingredients,
        allow_optional_ingredients:
          props.recipeOptions.allow_optional_ingredients,
      });
    };

    const handleRemoveClick = () => {
      const ingredients = [...props.recipeOptions.ingredients];
      ingredients.splice(index, 1);

      props.setRecipeOptions({
        ingredients: ingredients,
        allow_optional_ingredients:
          props.recipeOptions.allow_optional_ingredients,
      });
    };

    return (
      <RecipeRow
        key={index}
        row={row}
        setRow={setRow}
        ingredients={props.ingredients}
        units={props.units}
        mode="edit"
        onAction={handleRemoveClick}
      />
    );
  });

  const handleAddClick = () => {
    const ingredients = [...props.recipeOptions.ingredients];
    ingredients.push(editRow);

    props.setRecipeOptions({
      ingredients: ingredients,
      allow_optional_ingredients:
        props.recipeOptions.allow_optional_ingredients,
    });
    setEditRow({
      amount: '',
      unit: '',
      ingredient: '',
      option: '<free>',
    });
  };

  return (
    <div>
      {rows}
      <RecipeRow
        row={editRow}
        setRow={setEditRow}
        ingredients={props.ingredients}
        units={props.units}
        mode="add"
        onAction={handleAddClick}
      />
      <StyledTagAction onClick={props.onAction}>
        Rezept generieren
      </StyledTagAction>
    </div>
  );
}
