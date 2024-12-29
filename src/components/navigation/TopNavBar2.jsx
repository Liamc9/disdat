import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import styled from 'styled-components';

const NavBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  margin-left: -16px;
  display: flex;
  align-items: center;
  height: 62px;
  white-space: nowrap;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid rgba(44, 45, 42, 0.25);
  background-color: var(--beach-bg);
`;

const Logo = styled.img`
  width: 116px;
  margin-left: 60px;
`;

const MenuContainer = styled.div`
  display: none;
  @media (min-width: 640px) {
    display: flex;
    margin-left: auto;
    align-items: center;
    gap: 32px;
  }
`;

const MenuButton = styled.button`
  color: ${(props) => (props.active ? 'blue' : 'black')};
  border-bottom: ${(props) => (props.active ? '2px solid blue' : 'none')};
  transition: all 0.3s;

  &:hover {
    color: blue;
  }
`;

const HeaderIcons = styled.div`
  margin-left: auto;
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const SignInButton = styled.button`
  border-radius: 9999px;
  background-color: black;
  color: white;
  padding: 8px 24px;
  transition: all 0.3s;

  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }

  &:focus {
    transform: translateY(2px);
  }
`;

const TopNavBar2 = ({ menuItems, activeTab: propActiveTab, onTabClick }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab);
  const navigate = useNavigate();

  // Update the internal state if the propActiveTab changes
  useEffect(() => {
    setActiveTab(propActiveTab);
  }, [propActiveTab]);

  const handleTabClick = (item) => {
    setActiveTab(item); // Update internal state to reflect the clicked tab
    if (onTabClick) {
      onTabClick(item); // Pass the new active tab to the parent component
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <NavBarContainer>
      <SideNav />
      <Logo
        src="https://cdn.shopify.com/s/files/1/0689/1443/files/CLOSCA-LOGO-WEB-BLACK_130x@2x.png?v=1559116993"
        alt="Closca Logo"
      />
      <MenuContainer>
        {menuItems.map((item) => (
          <MenuButton
            key={item}
            onClick={() => handleTabClick(item)}
            active={item === activeTab}
          >
            {item}
          </MenuButton>
        ))}
      </MenuContainer>
      <HeaderIcons>
        <SignInButton onClick={handleSignInClick}>Sign In</SignInButton>
      </HeaderIcons>
    </NavBarContainer>
  );
};

TopNavBar2.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.string).isRequired, // Expecting an array of menu item strings
  activeTab: PropTypes.string, // Expecting the active tab to be a string
  onTabClick: PropTypes.func, // Function to handle tab click events
};

TopNavBar2.defaultProps = {
  activeTab: '',
  onTabClick: null,
};

export default TopNavBar2;
