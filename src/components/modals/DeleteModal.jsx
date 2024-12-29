// src/components/DeleteModal.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  ${(props) =>
    props.animate &&
    css`
      animation: ${fadeIn} 0.3s ease-out forwards;
    `}
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  ${(props) =>
    props.animate &&
    css`
      animation: ${slideIn} 0.3s ease-out forwards;
    `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #333;

  &:hover {
    color: #555;
  }
`;

const ModalContent = styled.div`
  padding: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #333;
`;

const ModalBody = styled.div`
  font-size: 1rem;
  color: #555;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #777;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #bdc3c7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: #95a5a6;
  }
`;

// DeleteModal Component
const DeleteAccountModal = ({
  onCancel,
  onConfirm,
  title,
  message,
  animate = true,
  requiresPassword = false,
}) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (requiresPassword && !password.trim()) {
      toast.error("Password cannot be empty.");
      return;
    }

    setIsProcessing(true);
    try {
      if (requiresPassword) {
        await onConfirm(password);
      } else {
        await onConfirm();
      }
    } catch (error) {
      console.error("Error in confirmation:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return ReactDOM.createPortal(
    <Overlay animate={animate} onClick={onCancel}>
      <ModalContainer
        animate={animate}
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <CloseButton onClick={onCancel} aria-label="Close Modal">
          &times;
        </CloseButton>
        <ModalContent>
          {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
          <ModalBody id="modal-description">{message}</ModalBody>
          {requiresPassword && (
            <form onSubmit={handleConfirm}>
              <PasswordInput
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ButtonContainer>
                <CancelButton type="button" onClick={onCancel}>
                  Cancel
                </CancelButton>
                <ConfirmButton type="submit" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Confirm"}
                </ConfirmButton>
              </ButtonContainer>
            </form>
          )}
          {!requiresPassword && (
            <ButtonContainer>
              <CancelButton type="button" onClick={onCancel}>
                Cancel
              </CancelButton>
              <ConfirmButton type="button" onClick={handleConfirm} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Delete"}
              </ConfirmButton>
            </ButtonContainer>
          )}
        </ModalContent>
      </ModalContainer>
    </Overlay>,
    document.getElementById("modal-root")
  );
};

DeleteAccountModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  animate: PropTypes.bool,
  requiresPassword: PropTypes.bool,
};

export default DeleteAccountModal;
