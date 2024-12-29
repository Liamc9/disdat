// src/components/ProfileData.js

import React, { useState, useEffect, useRef } from "react";
import ProfileView from "../components/views/ProfileView";
import { useAuth } from "../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth, deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase-config";

const Profile = () => {
  const { currentUser, userData, updateUserData, logout } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const storage = getStorage();
  const auth = getAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);


  const handleSaveChanges = async () => {
    if (!firstName.trim()) {
      toast.error("First name cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);

      let downloadURL = userData.photoURL || "https://via.placeholder.com/120";

      if (newProfilePicFile) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${newProfilePicFile.name}`);
        await uploadBytes(storageRef, newProfilePicFile);
        downloadURL = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "users", currentUser.uid);

      // Determine if profile is complete
      // For example: If firstName is not empty and profilePic is not a placeholder, consider it complete
      const isProfileComplete = firstName.trim() !== "" && downloadURL !== "https://via.placeholder.com/120";

      await updateDoc(docRef, {
        displayName: firstName,
        photoURL: downloadURL,
        profileComplete: isProfileComplete,
      });

      await updateUserData({
        displayName: firstName,
        photoURL: downloadURL,
        profileComplete: isProfileComplete,
      });

      setNewProfilePicFile(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };



  const confirmDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found.");
      }

      const providerData = user.providerData;
      if (providerData.length === 0) {
        throw new Error("No provider data available.");
      }

      const providerId = providerData[0].providerId;

      if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        throw new Error(`Unsupported provider: ${providerId}`);
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User document does not exist.");
      }

      const userDocData = userDocSnap.data();
      const listings = userDocData.listings || [];

      const batch = writeBatch(indexedDB);

      listings.forEach((listingId) => {
        const listingDocRef = doc(db, "listings", listingId);
        batch.delete(listingDocRef);
      });

      batch.delete(userDocRef);
      await batch.commit();

      await deleteUser(user);

      await logout();
      toast.success("Account and associated listings deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account and listings:", error);

      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-authenticate to delete your account.");
      } else if (error.message.includes("Unsupported provider")) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete account. Please try again later.");
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <ProfileView
      firstName={firstName}
      setFirstName={setFirstName}
      profilePic={profilePic}
      fileInputRef={fileInputRef}
      handleSaveChanges={handleSaveChanges}
      isSaving={isSaving}
      showDeleteModal={showDeleteModal}
      confirmDeleteAccount={confirmDeleteAccount}
      setShowDeleteModal={setShowDeleteModal}
      currentUser={currentUser}
      setProfilePic={setProfilePic}
      userData={userData}
      setNewProfilePicFile={setNewProfilePicFile}
      newProfilePicFile={newProfilePicFile}
    />
  );
};

export default Profile;
