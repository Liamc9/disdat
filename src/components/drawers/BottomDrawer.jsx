import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

// Styled components for the drawer, background, and handle
const DrawerContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); // This is equivalent to Tailwind's bg-opacity-50
  transition: opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
`;

const Drawer = styled.div`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  height: ${({ autoHeight, height }) => (autoHeight ? "auto" : height)};
  background-color: white;
  border-radius: 16px 16px 0 0; // Rounded top corners
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // Equivalent to shadow-lg
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(100%)")};
  transition: transform ${({ transitionDuration }) => transitionDuration}ms ease-in-out,
    opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  display: flex;
  flex-direction: column;
`;

const Handle = styled.div`
  width: 48px;
  height: 4px;
  background-color: #d1d5db; // Equivalent to Tailwind's bg-gray-300
  border-radius: 9999px; // Fully rounded
  margin: 8px auto; // Centered with some spacing
`;

const DrawerContent = styled.div`
  flex: 1;
  overflow-y: ${({ autoHeight }) => (autoHeight ? "visible" : "auto")}; /* Make content scrollable if not auto-height */
  padding: 16px; /* Add padding inside the drawer */
`;

export default function BottomDrawer({
  isOpen,
  onClose,
  children,
  transitionDuration = 300, // Default transition duration in ms
  height = "80vh", // Default height as percentage
  autoHeight = false, // Use auto height based on content if true
  maxWidth = "600px", // Default max width for the drawer
}) {
  const drawerRef = useRef();

  // Close the drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return createPortal(
    <DrawerContainer isOpen={isOpen} transitionDuration={transitionDuration}>
      {/* Background overlay */}
      <BackgroundOverlay isOpen={isOpen} onClick={onClose} transitionDuration={transitionDuration} />

      {/* Drawer content */}
      <Drawer
        ref={drawerRef}
        isOpen={isOpen}
        transitionDuration={transitionDuration}
        height={height}
        autoHeight={autoHeight}
        maxWidth={maxWidth}
      >
        {/* Drawer handle */}
        <Handle />
        {/* Scrollable or auto-adjusted content area */}
        <DrawerContent autoHeight={autoHeight}>{children}</DrawerContent>
      </Drawer>
    </DrawerContainer>,
    document.body
  );
}
