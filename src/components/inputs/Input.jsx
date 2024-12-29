import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  font-family: sans-serif;
`;

const sharedInputStyles = css`
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid;
  background: transparent;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease-in-out;
`;

const StyledInput = styled.input`
  ${sharedInputStyles}
  border-color: ${({ isFocused, color }) => (isFocused ? color : '#D1D5DB')};
`;

const StyledTextarea = styled.textarea`
  ${sharedInputStyles}
  border-color: ${({ isFocused, color }) => (isFocused ? color : '#D1D5DB')};
`;

const StyledLabel = styled.label`
  position: absolute;
  left: 0;
  margin: 0.25rem;
  padding: 0.25rem;
  background: white;
  color: ${({ isFocused, color }) => (isFocused ? color : '#6B7280')};
  font-size: 1rem;
  pointer-events: none;
  transform: ${({ hasValue, isFocused }) =>
    hasValue || isFocused ? 'translate(1.25rem, -70%) scale(0.9)' : 'translate(0.625rem, 0)'};
  transform-origin: left top;
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
`;

const Input = ({ name, type, value, onChange, color = '#000', label }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputElement =
    type === 'textarea' ? (
      <StyledTextarea
        name={name}
        id={name}
        required
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isFocused={isFocused}
        color={color}
      />
    ) : (
      <StyledInput
        name={name}
        id={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isFocused={isFocused}
        color={color}
      />
    );

  return (
    <InputContainer>
      {inputElement}
      <StyledLabel
        htmlFor={name}
        isFocused={isFocused}
        color={color}
        hasValue={Boolean(value)}
      >
        {label}
      </StyledLabel>
    </InputContainer>
  );
};

export default Input;
