// src/routes/Root.js

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  HomeIcon3,
  SearchIcon2,
  UserIcon3,
  CogIcon,
  LoginIcon,
  ChatIcon,
} from "../components/icons/Icons";
import { useNotifications } from "../context/NotificationContext";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth functions
import { useAuth } from "../context/AuthContext"; // Import AuthContext for currentUser
import SplashScreen from "../components/disdat/splashScreen"; // Import the SplashScreen component

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  const [isLoading, setIsLoading] = useState(true); // State to manage splash screen visibility

  // Scroll to top whenever the location.pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Manage splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the duration as needed (match SplashScreen's animation delay + duration)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="root" className="w-full overflow-x-hidden bg-white">
      {isLoading && <SplashScreen />} {/* Render SplashScreen if isLoading is true */}
      <Outlet />
    </div>
  );
}
