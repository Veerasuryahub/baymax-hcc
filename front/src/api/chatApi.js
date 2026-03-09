import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get fresh token on every request (fixes stale token bug)
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const API = axios.create({ baseURL: API_URL });

export const createChatSection = async (title) =>
  (await API.post("/chat/section", { title }, { headers: getAuthHeader() })).data;

export const getChatHistory = async () =>
  (await API.get("/chat/history", { headers: getAuthHeader() })).data;

export const addMessageToChat = async (sectionIndex, sender, text) =>
  (await API.post(
    "/chat/message",
    { sectionIndex, sender, text },
    { headers: getAuthHeader() }
  )).data;

export const deleteChatSection = async (sectionIndex) =>
  (await API.delete(`/chat/section/${sectionIndex}`, { headers: getAuthHeader() })).data;

export const submitReview = async (rating, comment) =>
  (await API.post(
    "/review",
    { rating, comment },
    { headers: getAuthHeader() }
  )).data;
