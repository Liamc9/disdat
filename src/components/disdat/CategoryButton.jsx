// src/components/disdat/CategoryButton.js

import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Button = styled.button`
  width: 100%;
  padding: 14px 20px 10px;
  border-radius: 8px;
  font-size: 2rem;
  cursor: pointer;
  text-align: center;
  font-weight: 800;
  color: #007bff;
  
`;

const CategoryButton = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

CategoryButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default CategoryButton;
