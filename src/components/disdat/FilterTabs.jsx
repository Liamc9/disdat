// src/components/FilterTabs.js

import React from 'react';
import styled from 'styled-components';
import CategorySearch from './CategorySearch'; // Adjust the import path accordingly
import PropTypes from 'prop-types'; // Import PropTypes

// Styled Components
const FilterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white; /* Adjust as needed */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50; /* Ensures it overlays other content */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
`;

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Tab = styled.button`
  background: none;
  flex: 1; /* Ensures equal width */
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  color: ${({ isActive }) => (isActive ? '#007bff' : '#6B7280')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  transition: color 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px; /* Slight adjustment to align with border */
    left: 0;
    width: ${({ isActive }) => (isActive ? '100%' : '0')};
    height: 3px;
    background-color: #007bff;
    transition: width 0.3s ease-in-out;
  }

  &:hover:after {
    width: 100%;
  }

  &:focus {
    outline: none;
  }
`;

const FilterTabs = ({
  selectedOption,
  onSelectChange,
  activeTab,
  onTabClick,
  selectOptions,
  onAddGroup, // New prop for adding a group
}) => {
  return (
    <FilterContainer>
      {/* Replace SelectInput with CategorySearch */}
      <CategorySearch
        categories={selectOptions}
        selectedCategory={selectedOption}
        onCategorySelect={onSelectChange}
        onAddGroup={onAddGroup} // Pass the add group handler
      />
      <TabsContainer>
        <Tab
          isActive={activeTab === 'trending'}
          onClick={() => onTabClick('trending')}
          aria-label="Trending"
        >
          Trending
        </Tab>
        <Tab
          isActive={activeTab === 'top'}
          onClick={() => onTabClick('top')}
          aria-label="Top"
        >
          Top
        </Tab>
        <Tab
          isActive={activeTab === 'recent'}
          onClick={() => onTabClick('recent')}
          aria-label="Recent"
        >
          Recent
        </Tab>
      </TabsContainer>
    </FilterContainer>
  );
};

// Define PropTypes
FilterTabs.propTypes = {
  selectedOption: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddGroup: PropTypes.func.isRequired, // New prop type
};

export default FilterTabs;
