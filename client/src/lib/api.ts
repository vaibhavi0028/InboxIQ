import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  getGoogleAuthURL: () => `${API_BASE_URL}/auth/google`,
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const emailsAPI = {
  fetchEmails: () => api.get("/emails"),
  fetchClassified: () => api.get("/emails/classified"),
};

export const automationAPI = {
  send: (data: { to: string; subject: string; body: string }) =>
    api.post("/automation/send", data),
  reply: (data: { to: string; subject: string; snippet: string }) =>
    api.post("/automation/reply", data),
  autoReply: () => api.post("/automation/auto-reply"),
  label: (data: { messageId: string; label: string }) =>
    api.post("/automation/label", data),
  summarize: (data: { subject: string; snippet: string }) =>
    api.post("/automation/summarize", data),
};

export const categoriesAPI = {
  getCategories: () => api.get("/categories"),
  addCategory: (category: string) =>
    api.post("/categories/add", { category }),
  setPriority: (priorityOrder: string[]) =>
    api.post("/categories/priority", { priorityOrder }),
};

export default api;
