// src/pages/Home.js

import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  increment,
  getDocs,
  startAfter,
  limit,
  setDoc,
    serverTimestamp,
} from "firebase/firestore";
import styled from "styled-components";
import FilterTabs from "../components/disdat/FilterTabs";
import PostButton from "../components/disdat/postButton"; // Ensure correct casing
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load PollItem component
const PollItem = lazy(() => import("../components/disdat/PollItem"));

// Styled Components
export const HomeContainer = styled.div`
  max-width: 800px;
`;

export const PollsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2em;
  color: #666;
  margin: 20px 0;
`;

export const ErrorMessage = styled.p`
  text-align: center;
  color: red;
  font-size: 1.2em;
  margin: 20px 0;
`;

// Constants
const PAGE_SIZE = 3; // Number of polls to fetch per page

// Home Component
export default function Home() {
  // State for FilterTabs
  const [selectedOption, setSelectedOption] = useState("all");
  const [activeTab, setActiveTab] = useState("trending");

  // State for groups
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState(null);

  // State for polls and pagination
  const [polls, setPolls] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Ref for the sentinel element
  const observer = useRef();

 // Function to fetch groups
const fetchGroups = async () => {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      // Fetch all groups, including the 'trending' attribute
      const groupsQuery = query(collection(db, "groups"), orderBy("label", "asc"));
      const querySnapshot = await getDocs(groupsQuery);
      const fetchedGroups = querySnapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().label,
        trending: doc.data().trending || false, // Ensure 'trending' is a boolean
        // Include other group fields if necessary
      }));
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups: ", error);
      setGroupsError("Failed to load groups. Please try again.");
    } finally {
      setGroupsLoading(false);
    }
  };
  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Define options for CategorySearch
  const selectOptions = [
    { value: "all", label: "All Categories" },
    ...groups,
  ];

  // Function to handle adding a new group
  const handleAddGroup = async (groupName) => {
    if (!groupName || groupName.trim() === "") {
      toast.error("Group name cannot be empty.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Normalize the group name to create a valid Firestore document ID
    const normalizedGroupName = groupName.trim().toLowerCase().replace(/\s+/g, '_');

    // Optional: Check if the group already exists to prevent duplicates
    const groupExists = groups.some(
      (group) => group.value.toLowerCase() === normalizedGroupName
    );
    if (groupExists) {
      toast.error("A group with this name already exists.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    try {
      // Reference to the new group document with the normalized group name as ID
      const groupDocRef = doc(db, "groups", normalizedGroupName);

      // Set the document with the specified ID
      await setDoc(groupDocRef, {
        label: groupName.trim(),
        createdAt: serverTimestamp(), // Use serverTimestamp for consistency
        // Add other fields as necessary, e.g., createdBy
        // createdBy: currentUser.id, // If you have user authentication
      });

      // Update the local state with the new group
      const newGroup = {
        value: groupDocRef.id, // This is the normalized group name
        label: groupName.trim(),
        // Include other fields if necessary
      };
      setGroups((prevGroups) => [...prevGroups, newGroup]);

      // Optionally, set the new group as selected
      setSelectedOption(newGroup.value);

      toast.success(`Group "${groupName}" has been created successfully.`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding group: ", error);
      toast.error("Failed to create the group. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  // Function to build Firestore query based on filters
  const buildQuery = (startAfterDoc = null) => {
    const constraints = [];

    // Apply category filter if not 'all'
    if (selectedOption !== "all") {
      constraints.push(where("category", "==", selectedOption));
    }

    // Apply sorting based on activeTab
    switch (activeTab) {
      case "trending":
        // Assuming you have a 'trendingScore' field
        constraints.push(orderBy("trendingScore", "desc"));
        break;
      case "top":
        // Assuming you have a 'votes' field with 'opt1' and 'opt2'
        constraints.push(orderBy("votes.opt1", "desc"), orderBy("votes.opt2", "desc"));
        break;
      case "recent":
        // Assuming you have a 'createdAt' timestamp field
        constraints.push(orderBy("createdAt", "desc"));
        break;
      default:
        break;
    }

    // Add a secondary orderBy to ensure unique ordering
    constraints.push(orderBy("__name__", "asc")); // Using document ID as tiebreaker

    // Apply pagination
    constraints.push(limit(PAGE_SIZE));

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    return query(collection(db, "polls"), ...constraints);
  };

  // Fetch polls function
  const fetchPolls = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const q = buildQuery(lastVisible);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newPolls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out any duplicates just in case
        setPolls((prevPolls) => {
          const pollsMap = new Map();
          prevPolls.forEach((poll) => pollsMap.set(poll.id, poll));
          newPolls.forEach((poll) => pollsMap.set(poll.id, poll));
          return Array.from(pollsMap.values());
        });

        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);

        // If fetched less than PAGE_SIZE, no more documents
        if (snapshot.docs.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching polls: ", err);
      setError("Failed to load polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch initial polls or when filters change
  useEffect(() => {
    // Reset states when filters change
    setPolls([]);
    setLastVisible(null);
    setHasMore(true);
    setError(null);

    // Fetch the first page
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, activeTab]);

  // useEffect to set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        // Load next batch of polls
        fetchPolls();
      }
    };

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    // Clean up any previous observer before creating a new one
    const currentObserver = observer.current;
    if (currentObserver) currentObserver.disconnect();

    observer.current = new IntersectionObserver(handleObserver, options);
    const sentinel = document.querySelector("#sentinel");
    if (sentinel) observer.current.observe(sentinel);

    // Cleanup
    return () => {
      if (observer.current) observer.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, polls]);

  // Handle Category Selection
  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  // Handle Tab Click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to submit form data
  const submitForm = async (pollData) => {
    try {
      // Add a new document with a generated id.
      await addDoc(collection(db, "polls"), {
        ...pollData,
        votes: { opt1: 0, opt2: 0 }, // Initialize votes
        createdAt: new Date(), // Initialize creation timestamp
        trendingScore: 0, // Initialize trending score
      });
      toast.success("Poll has been posted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      // Optionally, refetch polls or optimistically add the new poll to the state
      fetchPolls();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to post the poll. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  // Function to handle voting
  const handleVote = async (pollId, chosenOption) => {
    const pollRef = doc(db, "polls", pollId);

    try {
      // Update the chosen option's vote count by incrementing it by 1
      await updateDoc(pollRef, {
        [`votes.${chosenOption}`]: increment(1),
      });

      // Optionally, update 'trendingScore' based on voting activity
      await updateDoc(pollRef, {
        trendingScore: increment(1),
      });

      // Update the local state for the voted poll
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId
            ? {
                ...poll,
                votes: {
                  ...poll.votes,
                  [chosenOption]: poll.votes[chosenOption] + 1,
                },
                trendingScore: poll.trendingScore + 1,
              }
            : poll
        )
      );
    } catch (error) {
      console.error("Error updating vote: ", error);
      toast.error("Failed to update your vote. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <HomeContainer>
      {/* Include the FilterTabs component with props */}
      <FilterTabs
        selectedOption={selectedOption}
        onSelectChange={handleSelectChange}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        selectOptions={selectOptions}
        onAddGroup={handleAddGroup} // Pass the add group handler
      />

      {/* Spacer to prevent content from being hidden behind the fixed FilterTabs */}
      <div style={{ height: "120px" }}></div>

      {/* Display Polls */}
      <PollsList>
        {polls.map((poll) => (
          <Suspense
            fallback={<LoadingMessage>Loading poll...</LoadingMessage>}
            key={poll.id} // Ensure unique key
          >
            <PollItem
              id={poll.id} // Pass the poll ID
              question={poll.question}
              category={poll.category}
              opt1={poll.opt1}
              opt2={poll.opt2}
              votesOpt1={poll.votes.opt1}
              votesOpt2={poll.votes.opt2}
              percOpt1={
                poll.votes.opt1 + poll.votes.opt2 > 0
                  ? (poll.votes.opt1 / (poll.votes.opt1 + poll.votes.opt2)) * 100
                  : 0
              }
              percOpt2={
                poll.votes.opt1 + poll.votes.opt2 > 0
                  ? (poll.votes.opt2 / (poll.votes.opt1 + poll.votes.opt2)) * 100
                  : 0
              }
              handleVote={handleVote} // Pass the handler
            />
          </Suspense>
        ))}
      </PollsList>

      {/* Sentinel element for IntersectionObserver (infinite scroll trigger) */}
      <div id="sentinel" style={{ marginBottom: "40px" }}></div>

      {/* Loading State */}
      {loading && <LoadingMessage>Loading more polls...</LoadingMessage>}

      {/* Error State */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* No Polls Available */}
      {!loading && polls.length === 0 && !error && (
        <LoadingMessage>No polls available at the moment.</LoadingMessage>
      )}

      {/* Post Button to open the form */}
      <PostButton submitForm={submitForm} currentCategory={selectedOption} />

      {/* Groups Loading/Error Feedback */}
      {groupsLoading && <LoadingMessage>Loading groups...</LoadingMessage>}
      {groupsError && <ErrorMessage>{groupsError}</ErrorMessage>}
    </HomeContainer>
  );
}
