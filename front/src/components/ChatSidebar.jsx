import React, { useState } from "react";
import { Trash2, LogOut } from "lucide-react";
import { deleteChatSection } from '../api/chatApi';
import { removeAuthToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const ChatSidebar = ({ sections, onSelect, onNewChat, current, onRefresh }) => {
  const [deletingIndex, setDeletingIndex] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
  };

  const handleDelete = async (index) => {
    try {
      setDeletingIndex(index);
      await deleteChatSection(index);
      // Refresh the chat list instead of full page reload
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete chat section:', error.response?.data?.error || error.message);
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      <button
        onClick={onNewChat}
        className="mb-4 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition"
      >
        ➕ New Chat
      </button>
      <div className="flex-1 overflow-y-auto space-y-2">
        {sections.map((s, idx) => (
          <div
            key={s._id || idx}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-2 rounded-md transition ${idx === current ? "bg-red-100" : "hover:bg-gray-100"
              }`}
          >
            <span className="truncate">🗂️ {s.title || `Chat ${idx + 1}`}</span>
            <Trash2
              className={`w-4 h-4 text-red-500 hover:text-red-700 flex-shrink-0 ${deletingIndex === idx ? "opacity-50" : ""
                }`}
              onClick={(e) => {
                e.stopPropagation();
                if (deletingIndex === null) handleDelete(idx);
              }}
            />
          </div>
        ))}
      </div>

      {/* Logout Button at bottom */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition border border-transparent hover:border-red-200"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
};

export default ChatSidebar;
