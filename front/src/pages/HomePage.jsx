import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { createChatSection, getChatHistory } from "../api/chatApi";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auth guard: redirect if not logged in
    if (!isLoggedIn()) {
      navigate("/auth");
      return;
    }

    const loadChats = async () => {
      try {
        const history = await getChatHistory();
        setSections(history);
        if (history.length > 0) setCurrentSectionIndex(0);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        if (error.response?.status === 401) {
          navigate("/auth");
        }
      }
    };
    loadChats();
  }, [navigate]);

  const handleNewChat = async () => {
    try {
      const newSection = await createChatSection("New Chat");
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      setCurrentSectionIndex(updatedSections.length - 1);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const refreshChats = async () => {
    try {
      const history = await getChatHistory();
      setSections(history);
    } catch (error) {
      console.error("Failed to refresh chats:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <ChatSidebar
        sections={sections}
        onSelect={setCurrentSectionIndex}
        onNewChat={handleNewChat}
        current={currentSectionIndex}
        onRefresh={refreshChats}
      />
      <ChatWindow
        section={sections[currentSectionIndex]}
        sectionIndex={currentSectionIndex}
        refresh={refreshChats}
      />
    </div>
  );
};

export default HomePage;