import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDownIcon } from '../icons/Icons';

const SelectContainer = styled.div`
  position: relative;
  font-family: sans-serif;
`;

const sharedSelectStyles = css`
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid;
  background: transparent;
  font-size: 1rem;
  outline: none;
  appearance: none;
  transition: border-color 0.3s ease-in-out;
`;

const StyledSelect = styled.select`
  ${sharedSelectStyles}
  border-color: ${({ isFocused, color }) => (isFocused ? color : '#D1D5DB')};
  color: ${({ value }) => (value ? '#000' : '#6B7280')}; /* Default placeholder style */
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

const StyledArrow = styled.div`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
  color: ${({ isFocused, color }) => (isFocused ? color : '#6B7280')};
`;

const SelectInput = ({ name, value, onChange, color = '#000', label, options = [] }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <SelectContainer>
      <StyledSelect
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isFocused={isFocused}
        color={color}
      >
        <option value="" disabled>
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <StyledLabel
        htmlFor={name}
        isFocused={isFocused}
        color={color}
        hasValue={Boolean(value)}
      >
        {label}
      </StyledLabel>
      <StyledArrow isFocused={isFocused} color={color}>
        <ChevronDownIcon className='w-4 h-4'/>
      </StyledArrow>
    </SelectContainer>
  );
};

export default SelectInput;
