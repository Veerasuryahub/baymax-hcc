import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { createChatSection, getChatHistory } from "../api/chatApi";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive behavior */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <ChatSidebar
          sections={sections}
          onSelect={(idx) => {
            setCurrentSectionIndex(idx);
            setIsSidebarOpen(false); // Close on mobile after selection
          }}
          onNewChat={() => {
            handleNewChat();
            setIsSidebarOpen(false);
          }}
          current={currentSectionIndex}
          onRefresh={refreshChats}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-10 w-10 h-10 bg-[#E03C31] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <ChatWindow
          section={sections[currentSectionIndex]}
          sectionIndex={currentSectionIndex}
          refresh={refreshChats}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
};

export default HomePage;