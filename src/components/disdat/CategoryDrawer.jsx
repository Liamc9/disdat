// src/components/disdat/CategoryDrawer.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SearchBar2 from "./SearchBar2";

// Styled Components
const DrawerWrapper = styled.div`
  padding: 16px;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  max-height: 70vh; /* Adjust as needed */
  overflow-y: auto;
`;

const CategoryItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.4rem;
  color: ${({ isSelected }) => (isSelected ? "#007bff" : "#000")};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "600")};

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #777;
`;

const CreateGroupItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  background-color: #e0f7fa;
  border-bottom: 1px solid #b2ebf2;
  font-size: 1.4rem;
  color: #00796b;
  font-weight: 600;

  &:hover {
    background-color: #b2ebf2;
  }
`;

const CategoryDrawer = ({
  categories,
  onSelectCategory,
  selectedCategory,
  onCreateGroup, // New prop for handling group creation
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Trim and convert search query to lowercase for consistent comparison
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  // Determine if the user has started typing
  const isTyping = normalizedSearchQuery !== "";

  // Filter categories based on search query or trending status
  const filteredCategories = categories.filter((category) => {
    if (isTyping) {
      return category.label.toLowerCase().includes(normalizedSearchQuery);
    }
    return category.trending; // Show only trending groups when not typing
  });

  // Check if there's an exact match (case-insensitive)
  const hasExactMatch = categories.some(
    (category) => category.label.toLowerCase() === normalizedSearchQuery
  );

  return (
    <DrawerWrapper>
      <SearchBar2
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search groups..."
      />
      <CategoryList>
        {/* Conditionally render "Create Group" option */}
        {!hasExactMatch && isTyping && (
          <CreateGroupItem onClick={() => onCreateGroup(searchQuery.trim())}>
            Create group for "{searchQuery.trim()}"
          </CreateGroupItem>
        )}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryItem
              key={category.value}
              isSelected={selectedCategory === category.value}
              onClick={() => onSelectCategory(category.value)}
            >
              {category.label}
            </CategoryItem>
          ))
        ) : (
          <NoResults>No groups match your search.</NoResults>
        )}
      </CategoryList>
    </DrawerWrapper>
  );
};

CategoryDrawer.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      trending: PropTypes.bool.isRequired, // Ensure 'trending' is included
    })
  ).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCreateGroup: PropTypes.func.isRequired, // New prop type
};

export default CategoryDrawer;
