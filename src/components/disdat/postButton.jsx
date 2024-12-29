// src/components/PostButton.js

import React, { useState } from "react";
import styled from "styled-components";
import BottomDrawer from "../drawers/BottomDrawer";
import { PlusIcon, XIcon } from "../icons/Icons";
import PostForm from "./postForm"; // Ensure correct casing if your file is PostForm.jsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

// Styled component for the floating button
const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 10px;
  background-color: #007bff; /* Bootstrap primary color */
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  z-index: 50;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

// Styled component for the close button inside the drawer
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #111827;
  }

  &:focus {
    outline: none;
  }
`;

const PlusIconStyled = styled(PlusIcon)`
  width: 36px;
  height: 36px;
`;

// Styled component for the content inside the drawer
const DrawerContent = styled.div`
  padding: 20px;
  position: relative;
`;

// The PostButton Component
const PostButton = ({ submitForm, currentCategory }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Function to open the drawer
  const openDrawer = () => setDrawerOpen(true);

  // Function to close the drawer
  const closeDrawer = () => setDrawerOpen(false);

  // onSubmit function to handle form submission
  const handleFormSubmit = async (data) => {
    try {
      // Prepare the data to be uploaded
      const pollData = {
        question: data.question,
        category: currentCategory, // Use currentCategory prop instead of data.category
        opt1: data.opt1,
        opt2: data.opt2,
        votes: {
          opt1: 0,
          opt2: 0,
        },
        createdAt: new Date(), // Use Date instead of serverTimestamp for immediate timestamp
        trendingScore: 0, // Initialize as needed
      };

      // Call the submitForm prop with pollData
      await submitForm(pollData);

      // Show success toast
      toast.success("Poll created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Close the drawer
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to create poll. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <>

      {/* Floating Action Button */}
      <FloatingButton onClick={openDrawer} aria-label="Open Drawer">
        <PlusIconStyled />
      </FloatingButton>

      {/* Bottom Drawer */}
      <BottomDrawer isOpen={isDrawerOpen} onClose={closeDrawer} autoHeight>
        <DrawerContent>
          {/* Close Button */}
          <CloseButton onClick={closeDrawer} aria-label="Close Drawer">
            <XIcon />
          </CloseButton>

          {/* Drawer Content */}
          <PostForm onSubmit={handleFormSubmit} category={currentCategory} />
          {/* Add more content as needed */}
        </DrawerContent>
      </BottomDrawer>
    </>
  );
};

// Define PropTypes
PostButton.propTypes = {
  submitForm: PropTypes.func.isRequired,
  currentCategory: PropTypes.string.isRequired, // New prop for current category
};

export default PostButton;
