import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MenuIcon, CogIcon, LoginIcon } from "../icons/Icons";

export default function TopWSideNav({
  appName = "AppName",
  signInColor = "#000000",
  navLinks = [],
  username = "John Doe",
  profilePic = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
  onLogout,
}) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);

  const closeSideNav = () => setIsSideNavOpen(false);

  return (
    <>
      <NavBar>
        <NavContent>
          <DrawerButton onClick={toggleSideNav}>
            <MenuIcon className="icon" />
          </DrawerButton>
          <BrandLink to="/home">{appName}</BrandLink>
          <SignInLink to="/login" signInColor={signInColor}>
            Sign In
          </SignInLink>
        </NavContent>
      </NavBar>
      {isSideNavOpen && <Overlay onClick={closeSideNav} />}
      <SideNavContainer isOpen={isSideNavOpen} onClick={(e) => e.stopPropagation()}>
        <SideNavHeader to="/profile" onClick={closeSideNav}>
          <ProfileImage src={profilePic} alt="Profile" />
          <ProfileInfo>
            <Username>{username}</Username>
            <ViewProfile>View Profile</ViewProfile>
          </ProfileInfo>
        </SideNavHeader>

        <NavLinks>
          {navLinks.map(({ name, path, Icon }, index) => (
            <StyledLink to={path} key={index} onClick={closeSideNav}>
              {Icon && <IconWrapper>{<Icon className="icon" />}</IconWrapper>}
              <span>{name}</span>
            </StyledLink>
          ))}
        </NavLinks>

        <FooterLinks>
          <StyledLink to="/settings" onClick={closeSideNav}>
            <IconWrapper>
              <CogIcon className="icon" />
            </IconWrapper>
            <span>Settings</span>
          </StyledLink>
          <LogoutButton
            onClick={() => {
              onLogout();
              closeSideNav();
            }}
          >
            <IconWrapper>
              <LoginIcon className="icon" />
            </IconWrapper>
            <span>Log out</span>
          </LogoutButton>
        </FooterLinks>
      </SideNavContainer>
    </>
  );
}

// Styled Components
const NavBar = styled.nav`
  position: relative;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem; /* Reduced height */
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem; /* Reduced height */
  }
`;

const DrawerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;

  .icon {
    width: 2rem;
    height: 2rem;
  }
`;

const BrandLink = styled(Link)`
  font-size: 1.5rem; /* Adjusted for reduced height */
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
  flex-grow: 1;
`;

const SignInLink = styled(Link)`
  border-radius: 0.375rem;
  background-color: ${(props) => props.signInColor};
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.5);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 49;
  transition: opacity 0.3s ease-in-out;
  pointer-events: auto;
`;

const SideNavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 16rem;
  background: #ffffff;
  color: #1a202c;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  box-shadow: ${({ isOpen }) => (isOpen ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none")};
  z-index: 50;
`;

const SideNavHeader = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: #f7fafc;
  }
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
`;

const ViewProfile = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const NavLinks = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #2d3748;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  border-radius: 4px;

  &:hover {
    background: #f7fafc;
    color: #1a202c;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: 1px solid #e2e8f0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: #2d3748;
  cursor: pointer;
  width: 100%;
  border-radius: 4px;
  text-align: left;

  &:hover {
    background: #f7fafc;
    color: #1a202c;
  }
`;
