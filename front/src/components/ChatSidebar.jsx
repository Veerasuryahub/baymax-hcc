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
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col h-screen overflow-hidden shadow-2xl z-40">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-8 h-8 rounded-full bg-[#E03C31] flex items-center justify-center text-white font-bold text-sm shadow-md">
          B
        </div>
        <span className="text-white font-bold tracking-wider">BAYMAX</span>
      </div>

      <button
        onClick={onNewChat}
        className="mb-8 flex items-center justify-center gap-2 bg-[#E03C31] text-white py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(224,60,49,0.3)] hover:bg-red-700 hover:shadow-[0_0_20px_rgba(224,60,49,0.5)] transition-all"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold text-sm">New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-3">Recent Chats</h3>
        {sections.map((s, idx) => (
          <div
            key={s._id || idx}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all group ${idx === current
              ? "bg-slate-800 shadow-[0_2px_8px_rgb(0,0,0,0.2)] border border-slate-700"
              : "hover:bg-slate-800 hover:text-white text-slate-300"
              }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MessageSquare className={`w-4 h-4 flex-shrink-0 ${idx === current ? "text-[#E03C31]" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className={`truncate text-sm font-medium ${idx === current ? "text-[#E03C31]" : ""}`}>
                {s.title || `Chat Session ${idx + 1}`}
              </span>
            </div>
            <Trash2
              className={`w-4 h-4 text-slate-600 hover:text-[#E03C31] flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ${deletingIndex === idx ? "animate-pulse !opacity-50" : ""
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
      <div className="pt-4 border-t border-slate-800 mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
