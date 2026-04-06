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
    <div className="w-64 sm:w-72 bg-[#0f172a] border-r border-slate-800/60 p-4 sm:p-6 flex flex-col h-screen overflow-hidden z-40 relative">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-0 w-[60%] h-[40%] bg-[#E03C31]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 px-2 relative z-10">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-[0_8px_20px_rgba(224,60,49,0.3)] border border-white/10 ring-4 ring-red-500/5">
          B
        </div>
        <div>
          <span className="text-white font-black tracking-[0.2em] text-xs sm:text-sm uppercase">BAYMAX</span>
          <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest mt-0.5 flex items-center">
            <span className="w-1 h-1 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
            V1.0 PRO
          </div>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="mb-6 sm:mb-10 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#E03C31] to-[#ff6b6b] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-[0_15px_30px_rgba(224,60,49,0.25)] hover:shadow-[0_20px_40px_rgba(224,60,49,0.35)] hover:scale-[1.02] active:scale-95 transition-all group border border-white/10"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold text-xs sm:text-sm tracking-wide">New Analysis</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 scrollbar-hide">
        <div className="flex items-center justify-between px-2 mb-3 sm:mb-4">
          <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">History</h3>
          <div className="w-8 sm:w-10 h-[1px] bg-slate-800"></div>
        </div>
        
        {sections.map((s, idx) => (
          <div
            key={s._id || idx}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all group border ${idx === current
              ? "bg-slate-800/60 border-slate-700/50 shadow-xl"
              : "border-transparent hover:bg-slate-800/40 hover:border-slate-800 text-slate-400"
              }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors flex-shrink-0 ${idx === current ? "bg-[#E03C31]/10" : "bg-slate-800/50"}`}>
                <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${idx === current ? "text-[#E03C31]" : "text-slate-500 group-hover:text-slate-300"}`} />
              </div>
              <span className={`truncate text-xs sm:text-sm font-semibold tracking-tight ${idx === current ? "text-white" : "group-hover:text-slate-200"}`}>
                {s.title || `Session ${idx + 1}`}
              </span>
            </div>
            <Trash2
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 hover:text-[#E03C31] flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ${deletingIndex === idx ? "animate-pulse !opacity-50" : ""
                } ${idx === current ? "opacity-100" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (deletingIndex === null) handleDelete(idx);
              }}
            />
          </div>
        ))}
        {sections.length === 0 && (
          <div className="px-3 sm:px-4 py-8 sm:py-10 text-center border-2 border-dashed border-slate-800/50 rounded-2xl sm:rounded-3xl">
            <p className="text-[10px] sm:text-xs font-bold text-slate-600 tracking-widest uppercase">No Sessions Found</p>
          </div>
        )}
      </div>

      {/* Logout Button at bottom */}
      <div className="pt-4 sm:pt-6 border-t border-slate-800/60 mt-3 sm:mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full py-3 sm:py-4 px-4 sm:px-5 text-slate-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl sm:rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-2 sm:gap-3">
             <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold text-xs sm:text-sm tracking-wide">Secure Exit</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-red-500 transition-colors"></div>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
