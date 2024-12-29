import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SearchIcon2 } from "../icons/Icons"; // Assuming you have an icon component

// Container for the input and icon
const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #dcdcdc;
  border-radius: 25px;
  padding: 8px 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
`;

// Style for the input field
const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #333;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

// Style for the icon
const StyledIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchBar2 = ({ value, onChange, placeholder, onKeyDown, inputRef }) => {
  return (
    <SearchBarContainer>
      <StyledIcon>
        <SearchIcon2 /> {/* Replace with your actual icon component */}
      </StyledIcon>

      <StyledInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown} // Pass the onKeyDown handler
        ref={inputRef} // Assign the ref to the input element
      />
    </SearchBarContainer>
  );
};

SearchBar2.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func, // Ensure onKeyDown is optional
  inputRef: PropTypes.object, // Prop type for the ref
};

SearchBar2.defaultProps = {
  placeholder: "Search...",
  onKeyDown: null,
  inputRef: null,
};

export default SearchBar2;
