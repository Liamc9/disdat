import React from "react";
import styled from "styled-components";

const FieldContainer = styled.div`
  display: flex;
  align-items: center;

`;

const FieldName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  margin-right: auto;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 12px;
  background-color: ${(props) => (props.checked ? "#3b82f6" : "#d1d5db")};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &:before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    top: 2px;
    left: ${(props) => (props.checked ? "20px" : "2px")};
    transition: left 0.3s;
  }
`;

const ToggleField = ({ name, value, onChange }) => {
  const handleToggleChange = () => {
    onChange(!value);
  };

  return (
    <FieldContainer>
      <FieldName>{name}</FieldName>
      <ToggleWrapper>
        {/* Rename isChecked to checked when passing to the styled component */}
        <ToggleButton checked={value} onClick={handleToggleChange} />
      </ToggleWrapper>
    </FieldContainer>
  );
};
export default ToggleField;
