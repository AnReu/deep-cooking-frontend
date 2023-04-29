import React from 'react';
import styled from 'styled-components';
import BackgroundImage from './background.png';
import { AppV1 } from './v1/AppV1';
import { AppV2 } from './v2/AppV2';

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

export function App() {
  return (
    <>
      <StyledAppBackground></StyledAppBackground>
      <StyledApp>
        <AppV2 />
      </StyledApp>
    </>
  );
}
