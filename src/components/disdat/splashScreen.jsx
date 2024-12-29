// src/components/SplashScreen.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LettzIcon } from '../icons/Icons';

// Keyframes for fade-out animation
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Styled component for the splash screen container
const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007bff; /* Change to your desired background color */
  z-index: 9999;
  animation: ${fadeOut} 1s forwards;
  animation-delay: 1s; /* Duration before fade-out starts */
`;
const IconStyled = styled(LettzIcon)`
  width: 100px;
  height: 100px;
  color: white;
`;
const SplashScreen = () => {
  return (
    <SplashContainer>
      <IconStyled />
    </SplashContainer>
  );
};

export default SplashScreen;
