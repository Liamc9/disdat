import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronUpDownIcon } from '../../icons/Icons';

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const FieldName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  margin-right: auto;
`;

const FieldValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  margin-right: 12px;
`;

const Dropdown = styled.select`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  border: 1px solid #d1d5db; /* Equivalent to border-gray-300 */
  border-radius: 4px;
  padding: 4px 8px;
  width: auto;
  background: white;
  cursor: pointer;
`;

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.3s;

  &:hover {
    color: #4b5563;
  }
`;

const SelectField = ({ name, value, options, onChange, placeholder = 'Select value...' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(true);
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setIsDropdownOpen(false);
    onChange(newValue);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the label for the current value
  const getLabelForValue = (val) => {
    const option = options.find((opt) =>
      typeof opt === 'object' ? opt.value === val : opt === val
    );
    return typeof option === 'object' ? option.label : option;
  };

  return (
    <FieldContainer ref={dropdownRef}>
      <FieldName>{name}</FieldName>
      {isDropdownOpen ? (
        <Dropdown
          value={value}
          onChange={handleSelectChange}
          autoFocus
          onBlur={() => setIsDropdownOpen(false)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) =>
            typeof option === 'object' ? (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ) : (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </Dropdown>
      ) : (
        <FieldValue onClick={toggleDropdown}>
          {value ? getLabelForValue(value) : placeholder}
        </FieldValue>
      )}
      <ChevronWrapper onClick={toggleDropdown}>
        <ChevronUpDownIcon className="w-6 h-6" />
      </ChevronWrapper>
    </FieldContainer>
  );
};

export default SelectField;
