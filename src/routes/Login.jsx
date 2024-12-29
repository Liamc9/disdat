// Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path according to your file structure
import AuthPageView from '../components/views/AuthPageView'; // Assuming this is the UI component you're using
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { login, signup, resetPassword, loginWithGoogle, loginWithApple, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/"; // Default to home if no redirect route

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate(from); // Redirect to the original page
      } else {
        await logout();
        setError('Your email is not verified. Please verify your email.');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError('Invalid email or password. Please try again.');
    }
  };

  // Handle user signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenterPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password, username);
      setIsSignupComplete(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      setResetEmailSent(false);
      return;
    }

    try {
      await resetPassword(email);
      setResetEmailSent(true);
      setError('');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
      setResetEmailSent(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/explore'); // Replace with your desired route
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  

  return (
    <div className='p-4'>
    <AuthPageView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setUsername={setUsername}
      reenterPassword={reenterPassword}
      setReenterPassword={setReenterPassword}
      error={error}
      isSignupComplete={isSignupComplete}
      setIsSignupComplete={setIsSignupComplete}
      isLoading={isLoading}
      termsAccepted={termsAccepted}
      setTermsAccepted={setTermsAccepted}
      handleSignup={handleSignup}
      handleLogin={handleLogin}
      setShowSignUp={setShowSignUp}
      isSignUp={showSignUp}
      onForgotPassword={handleForgotPassword}
      resetEmailSent={resetEmailSent}
      onGoogleSignIn={handleGoogleSignIn}
      themeColor="#A855F7"
    />
    </div>
  );
};

export default Login;