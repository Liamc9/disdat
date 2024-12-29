import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// Styled Components
const BottomNavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 40;
`;

const NavItem = styled(NavLink)`
  position: relative;
  color: #6b7280;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;

  &.active {
    color: #a855f7;
  }


  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 0.25rem;
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 4px;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`;

// Component
const BottomNav = ({ items }) => {
  return (
    <BottomNavContainer>
      {items.map(({ text, icon: Icon, path, hasNotification }, index) => (
        <NavItem key={index} to={path}>
          <Icon />
          {hasNotification && <NotificationDot />}
          {text}
        </NavItem>
      ))}
    </BottomNavContainer>
  );
};

export default BottomNav;
