// src/components/PostForm.jsx

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import Input from "../inputs/Input"; // Adjust the import path as needed
import { toast } from "react-toastify";
import PropTypes from "prop-types"; // Import PropTypes

// PostForm Component
const PostForm = ({ onSubmit, category }) => {
  const [formData, setFormData] = useState({
    question: "",
    opt1: "",
    opt2: "",
  });

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const requiredFields = ["question", "opt1", "opt2"];
      const missingFields = requiredFields.filter(
        (field) => !formData[field]?.toString().trim()
      );

      if (missingFields.length) {
        toast.error(
          `Please fill in all required fields: ${missingFields.join(", ")}`,
          { position: "top-center", autoClose: 5000 }
        );
        return;
      }

      // Include the category in the submission
      onSubmit({ ...formData, category });
      // Reset form if needed
      setFormData({
        question: "",
        opt1: "",
        opt2: "",
      });
    },
    [formData, onSubmit, category]
  );

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Heading>Create New Poll in {category}</Heading>

      <FormSection>
        <Input
          id="question"
          name="question"
          type="text"
          label="Question"
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
          required
        />
      </FormSection>

      <FormSection>
        <Input
          id="opt1"
          name="opt1"
          label="Option 1"
          type="text"
          value={formData.opt1}
          onChange={(e) => handleChange("opt1", e.target.value)}
          required
        />
      </FormSection>

      <FormSection>
        <Input
          id="opt2"
          name="opt2"
          label="Option 2"
          type="text"
          value={formData.opt2}
          onChange={(e) => handleChange("opt2", e.target.value)}
          required
        />
      </FormSection>

      <SubmitButton type="submit">Submit</SubmitButton>
    </FormContainer>
  );
};

// Define PropTypes
PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired, // New prop for category
};

// Styled Components

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333333;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff; /* Bootstrap primary color */
  color: #fff;
  transition: background-color 0.2s;
  align-self: center;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 10px 16px;
    font-size: 18px;
    font-weight: 500;
  }
`;

export default PostForm;
