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
    <div className="w-72 bg-[#0f172a] border-r border-slate-800/60 p-6 flex flex-col h-screen overflow-hidden z-40 relative">
      {/* Subtle Glow Effect */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[40%] bg-[#E03C31]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-10 px-2 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_20px_rgba(224,60,49,0.3)] border border-white/10 ring-4 ring-red-500/5">
          B
        </div>
        <div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">BAYMAX</span>
          <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-0.5 flex items-center">
            <span className="w-1 h-1 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
            V1.0 PRO
          </div>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="mb-10 flex items-center justify-center gap-3 bg-gradient-to-r from-[#E03C31] to-[#ff6b6b] text-white py-4 px-6 rounded-2xl shadow-[0_15px_30px_rgba(224,60,49,0.25)] hover:shadow-[0_20px_40px_rgba(224,60,49,0.35)] hover:scale-[1.02] active:scale-95 transition-all group border border-white/10"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold text-sm tracking-wide">New Analysis</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">History</h3>
          <div className="w-10 h-[1px] bg-slate-800"></div>
        </div>
        
        {sections.map((s, idx) => (
          <div
            key={s._id || idx}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl transition-all group border ${idx === current
              ? "bg-slate-800/60 border-slate-700/50 shadow-xl"
              : "border-transparent hover:bg-slate-800/40 hover:border-slate-800 text-slate-400"
              }`}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className={`p-2 rounded-xl transition-colors ${idx === current ? "bg-[#E03C31]/10" : "bg-slate-800/50"}`}>
                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${idx === current ? "text-[#E03C31]" : "text-slate-500 group-hover:text-slate-300"}`} />
              </div>
              <span className={`truncate text-sm font-semibold tracking-tight ${idx === current ? "text-white" : "group-hover:text-slate-200"}`}>
                {s.title || `Session ${idx + 1}`}
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
        {sections.length === 0 && (
          <div className="px-4 py-10 text-center border-2 border-dashed border-slate-800/50 rounded-3xl">
            <p className="text-xs font-bold text-slate-600 tracking-widest uppercase">No Sessions Found</p>
          </div>
        )}
      </div>

      {/* Logout Button at bottom */}
      <div className="pt-6 border-t border-slate-800/60 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full py-4 px-5 text-slate-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
             <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold text-sm tracking-wide">Secure Exit</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-red-500 transition-colors"></div>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
