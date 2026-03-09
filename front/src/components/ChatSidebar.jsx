import React, { useState } from "react";
import { Trash2, LogOut, Plus, MessageSquare } from "lucide-react";
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
    <div className="w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col h-screen">
      <button
        onClick={onNewChat}
        className="mb-6 flex items-center justify-center gap-2 bg-[#E03C31] text-white py-3 px-4 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold text-sm">New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-2 mb-3">Recent Chats</h3>
        {sections.map((s, idx) => (
          <div
            key={s._id || idx}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all group ${idx === current
                ? "bg-white shadow-[0_2px_8px_rgb(0,0,0,0.06)] border border-gray-100"
                : "hover:bg-gray-100 hover:text-gray-900 text-gray-600"
              }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MessageSquare className={`w-4 h-4 flex-shrink-0 ${idx === current ? "text-[#E03C31]" : "text-gray-400 group-hover:text-gray-500"}`} />
              <span className={`truncate text-sm font-medium ${idx === current ? "text-[#E03C31]" : ""}`}>
                {s.title || `Chat Session ${idx + 1}`}
              </span>
            </div>
            <Trash2
              className={`w-4 h-4 text-gray-300 hover:text-red-500 flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ${deletingIndex === idx ? "animate-pulse !opacity-50" : ""
                } ${idx === current ? "opacity-100" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (deletingIndex === null) handleDelete(idx);
              }}
            />
          </div>
        ))}
      </div>

      {/* Logout Button at bottom */}
      <div className="pt-4 border-t border-gray-200 mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-gray-500 hover:text-[#E03C31] hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
