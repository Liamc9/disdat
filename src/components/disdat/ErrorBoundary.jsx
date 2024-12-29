// src/components/ErrorBoundary.js

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ErrorWrapper = styled.div`
  padding: 20px;
  background-color: #ffe6e6;
  color: #cc0000;
  border: 1px solid #cc0000;
  border-radius: 8px;
  text-align: center;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI on next render
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorWrapper>Something went wrong while loading this poll.</ErrorWrapper>;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
