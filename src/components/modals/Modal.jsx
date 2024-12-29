import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import PropTypes from "prop-types";
import { XIcon } from "../../Branding/icons/Icons";

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
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
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

// Modal Component
const Modal = ({
  isModalOpen,
  closeModal,
  title,
  children,
  animate = true,
}) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <Overlay animate={animate} onClick={closeModal}>
      <ModalContainer
        animate={animate}
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <CloseButton onClick={closeModal} aria-label="Close Modal">
          <XIcon />
        </CloseButton>
        <ModalContent>
          {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ModalContainer>
    </Overlay>,
    document.getElementById("modal-root")
  );
};

Modal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  animate: PropTypes.bool, // Enable or disable animations
};

export default Modal;
