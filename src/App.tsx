import React from 'react';
import styled from 'styled-components';
import BackgroundImage from './background.png';
import { AppV1 } from './v1/AppV1';
import { AppV2 } from './v2/AppV2';
import clsx from 'clsx';

const StyledAppBackground = styled.div`
  position: fixed;
  top: -1rem;
  left: -1rem;
  bottom: -1rem;
  right: -1rem;
  z-index: 0;

  background-image: url(${BackgroundImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  filter: blur(7px);

  box-shadow: rgba(0, 0, 0, 0.2) 0 0 4px 8px inset;
`;

const StyledApp = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
`;

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

const StyledVersionSelector = styled.div`
  display: flex;
  position: relative;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.2rem;
  margin-bottom: 0.8rem;

  button {
    appearance: none;
    padding: 0.4rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    line-height: 2rem;
    border: solid 1px var(--border-color);
    flex: 1 1 0;

    background-color: var(--secondary-hover-background);
    &:hover {
      background-color: var(--primary-background);
    }

    &.active {
      font-weight: bold;
      background-color: var(--tertiary-background);
      &:hover {
        background-color: var(--tertiary-hover-background);
      }
    }

    &:first-of-type {
      border-top-left-radius: 0.2rem;
      border-bottom-left-radius: 0.2rem;
    }

    &:last-of-type {
      border-top-right-radius: 0.2rem;
      border-bottom-right-radius: 0.2rem;
    }

    &:not(:first-of-type) {
      margin-left: -1px;
    }
  }
`;

export function App() {
  const [version, setVersion] = React.useState('V2' as 'V1' | 'V2');

  let content;
  switch (version) {
    case 'V1':
      content = <AppV1 />;
      break;
    case 'V2':
      content = <AppV2 />;
      break;
  }

  return (
    <>
      <StyledAppBackground></StyledAppBackground>
      <StyledApp>
        <StyledAppContainer>
          <StyledAppTitle>Willkommen auf Deep Cooking!</StyledAppTitle>
          <StyledAppSubtitle>
            Gib alle Zutaten ein, die verwendet werden sollen, und lass dir ein
            tolles Rezept generieren!
          </StyledAppSubtitle>
          <StyledVersionSelector>
            <button
              className={clsx({
                active: version === 'V1',
              })}
              onClick={() => setVersion('V1')}
            >
              Version 1
            </button>
            <button
              className={clsx({
                active: version === 'V2',
              })}
              onClick={() => setVersion('V2')}
            >
              Version 2
            </button>
          </StyledVersionSelector>
          {content}
        </StyledAppContainer>
      </StyledApp>
    </>
  );
}
