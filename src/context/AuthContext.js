// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
  deleteUser,
  signInAnonymously,
  linkWithCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import from react-firebase-hooks

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [firebaseUser, loading, error] = useAuthState(auth); 
  const [userData, setUserData] = useState(null);

  // Automatically sign in anonymously if no user is signed in
  useEffect(() => {
    if (!loading && !firebaseUser) {
      signInAnonymouslyUser().catch((err) => {
        console.error('Error during anonymous sign-in:', err);
      });
    }
  }, [firebaseUser, loading]);

  // Listen to Firestore user data in real-time
  useEffect(() => {
    if (!firebaseUser) {
      setUserData(null);
      return;
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        setUserData(docSnap.exists() ? docSnap.data() : null);
      },
      (err) => {
        console.error('Error fetching user data:', err);
        setUserData(null);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // Function to handle anonymous sign-in
  const signInAnonymouslyUser = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('Signed in anonymously:', userCredential.user.uid);
      // Initialize user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        isAnonymous: true,
        createdAt: new Date(),
      });
      return userCredential;
    } catch (err) {
      console.error('Anonymous Sign-In Error:', err);
      throw err;
    }
  };

  // Existing login with email/password
  const login = async (email, password) => {
    try {
      // If the current user is anonymous, link the credential instead of creating a new account
      if (firebaseUser && firebaseUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        const userCredential = await linkWithCredential(firebaseUser, credential);
        await updateProfile(userCredential.user, { email });
        await firebaseSendEmailVerification(userCredential.user);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          username: userCredential.user.displayName || '',
          createdAt: new Date(),
          isAnonymous: false,
        }, { merge: true });
        return userCredential;
      } else {
        return await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  // Updated signup to handle anonymous users
  const signup = async (email, password, username) => {
    try {
      if (firebaseUser && firebaseUser.isAnonymous) {
        // Link anonymous account with email/password
        const credential = EmailAuthProvider.credential(email, password);
        const userCredential = await linkWithCredential(firebaseUser, credential);
        await updateProfile(userCredential.user, { displayName: username });
        await firebaseSendEmailVerification(userCredential.user);

        // Update Firestore user data
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          username,
          createdAt: new Date(),
          isAnonymous: false,
        }, { merge: true });

        return userCredential;
      } else {
        // Create a new user with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        await firebaseSendEmailVerification(user);

        await setDoc(doc(db, 'users', user.uid), {
          email,
          username,
          createdAt: new Date(),
          isAnonymous: false,
        });

        return userCredential;
      }
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // If the user is anonymous, link their account with Google
      if (firebaseUser && firebaseUser.isAnonymous) {
        // Sign in with Google to get the credential
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
  
        // Link the credential to the anonymous account
        const linkedUser = await linkWithCredential(firebaseUser, credential);
  
        // Update Firestore data
        const userDocRef = doc(db, 'users', linkedUser.uid);
        await setDoc(userDocRef, {
          email: linkedUser.email,
          username: linkedUser.displayName || '',
          isAnonymous: false,
          updatedAt: new Date(),
        }, { merge: true });
  
        console.log('Anonymous account linked with Google successfully');
        return linkedUser;
      } else {
        // Regular Google login
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        // Update or create Firestore user document
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            username: user.displayName || '',
            createdAt: new Date(),
            isAnonymous: false,
          });
        }
  
        console.log('Signed in with Google successfully');
        return user;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      if (firebaseUser && firebaseUser.isAnonymous) {
        const result = await signInWithPopup(auth, provider);
        const credential = OAuthProvider.credentialFromResult(result);
  
        const linkedUser = await linkWithCredential(firebaseUser, credential);
  
        const userDocRef = doc(db, 'users', linkedUser.uid);
        await setDoc(userDocRef, {
          email: linkedUser.email || '',
          username: linkedUser.displayName || '',
          isAnonymous: false,
          updatedAt: new Date(),
        }, { merge: true });
  
        console.log('Anonymous account linked with Apple successfully');
        return linkedUser;
      } else {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email || '',
            username: user.displayName || '',
            createdAt: new Date(),
            isAnonymous: false,
          });
        }
  
        console.log('Signed in with Apple successfully');
        return user;
      }
    } catch (error) {
      console.error('Error signing in with Apple:', error);
      throw error;
    }
  };

  const updateUserData = async (data) => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userDocRef, data);
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const deleteUserData = async () => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    await deleteDoc(doc(db, 'users', firebaseUser.uid));
  };

  const reauthenticateWithEmail = async (email, password) => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(firebaseUser, credential);
  };

  const reauthenticateWithGoogle = async () => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(firebaseUser, provider);
  };

  const deleteFirebaseAccount = async () => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    await deleteUser(firebaseUser);
  };

  const deleteAccount = async (password = null) => {
    if (!firebaseUser) throw new Error('No user is currently signed in.');
    const providerData = firebaseUser.providerData;
    if (providerData.length === 0) {
      throw new Error('No provider data available.');
    }
    const providerId = providerData[0].providerId;

    if (providerId === 'google.com') {
      await reauthenticateWithGoogle();
    } else if (providerId === 'password') {
      if (!password) throw new Error('Password is required for reauthentication.');
      await reauthenticateWithEmail(firebaseUser.email, password);
    } else {
      throw new Error(`Unsupported provider: ${providerId}`);
    }

    await deleteUserData();
    await deleteFirebaseAccount();
  };

  // New method to explicitly sign in anonymously
  const explicitSignInAnonymously = async () => {
    try {
      // If there's an existing user (anonymous or not), sign out first
      if (firebaseUser) {
        await signOut(auth);
      }
      await signInAnonymouslyUser();
    } catch (err) {
      console.error('Explicit Anonymous Sign-In Error:', err);
      throw err;
    }
  };

  const value = {
    currentUser: firebaseUser,
    userData,
    loading, // you can still use loading from useAuthState
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithApple,
    updateUserData,
    deleteUserData,
    reauthenticateWithEmail,
    reauthenticateWithGoogle,
    deleteFirebaseAccount,
    deleteAccount,
    explicitSignInAnonymously, // Exposed method for anonymous sign-in
  };

  // Only render children when not loading auth state
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
