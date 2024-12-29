// src/components/disdat/CategorySearch.js

import React, { useState } from "react";
import styled from "styled-components";
import BottomDrawer from "../drawers/BottomDrawer"; // Adjust the import path as needed
import CategoryDrawer from "./CategoryDrawer"; // We'll create this next
import CategoryButton from "./CategoryButton"; // Button to open the drawer
import PropTypes from "prop-types"; // Import PropTypes

// Styled Components
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CategorySearch = ({
  categories,        // Array of category/group objects: { value, label }
  selectedCategory,  // Currently selected category
  onCategorySelect,  // Callback when a category is selected
  onAddGroup,        // New prop to handle adding a group
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Handlers to open and close the drawer
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  // Handler for creating a new group
  const handleCreateGroup = (groupName) => {
    // Call the onAddGroup prop passed from the parent
    if (onAddGroup) {
      onAddGroup(groupName);
    }
    // Close the drawer after creating the group
    handleCloseDrawer();
  };

  // Determine the button label
  const buttonLabel =
    selectedCategory === "all"
      ? "All Categories"
      : categories.find(cat => cat.value === selectedCategory)?.label || "Select Category";

  return (
    <>
      <ButtonsContainer>
        <CategoryButton onClick={handleOpenDrawer} aria-label="Select Category">
          {buttonLabel}
        </CategoryButton>
      </ButtonsContainer>

      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        transitionDuration={300}
        height="90vh" // Adjust the height as needed
      >
        <CategoryDrawer
          categories={categories}
          onSelectCategory={(category) => {
            onCategorySelect(category);
            handleCloseDrawer();
          }}
          selectedCategory={selectedCategory}
          onCreateGroup={handleCreateGroup} // Pass the create handler
        />
      </BottomDrawer>
    </>
  );
};

CategorySearch.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
  onAddGroup: PropTypes.func, // New prop for adding a group
};

CategorySearch.defaultProps = {
  onAddGroup: null,
};

export default CategorySearch;
