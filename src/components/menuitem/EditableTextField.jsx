import React, { useState } from "react";
import styled from "styled-components";

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldName = styled.div`
  font-size: 14px; /* Slightly larger for better readability */
  font-weight: 600; /* Makes it bold for emphasis */
  color: #6b7280; /* Tailwind's gray-500 equivalent */
`;

const EditableInput = styled.input`
  font-size: 16px;
  font-weight: 500;
  color: #111827; /* Tailwind's gray-900 equivalent */
  background-color: transparent; /* Removes background */
  padding: 4px 0 2px; /* Adds vertical padding, no horizontal padding */
  border: none; /* Removes all borders */
  border-bottom: 2px solid #d1d5db; /* Bottom border only */
  transition: border-color 0.3s ease; /* Smooth transition for focus effect */
  outline: none; /* Removes default focus outline */

  &:focus {
    border-bottom: 2px solid #3b82f6; /* Blue bottom border on focus */
  }

  &:hover {
    border-bottom: 2px solid #6b7280; /* Slightly darker border on hover */
  }
`;


const EditableTextField = ({ name, value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
  };

  const handleBlur = () => {
    onChange(currentValue); // Trigger the updateState function from EditStackedList
  };

  return (
    <FieldContainer>
      <FieldName>{name}</FieldName>
      <EditableInput
        value={currentValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
    </FieldContainer>
  );
};

export default EditableTextField;
