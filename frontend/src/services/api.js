import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global response handler: log out on 401 to avoid stale sessions
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // clear token and reload to login
      localStorage.removeItem("token");
      window.location = "/login";
    }
    return Promise.reject(error);
  },
);

// User API
export const userAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  getCurrentUser: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/profile", data),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
};

// Patient API
export const patientAPI = {
  getProfile: () => api.get("/patients/profile"),
  updateProfile: (data) => api.put("/patients/profile", data),
  addPreferredDoctor: (data) =>
    api.post("/patients/add-preferred-doctor", data),
  getRecords: () => api.get("/medical-records/me"),
  getPatientRecords: (patientId) =>
    api.get(`/medical-records/patient/${patientId}`),
  getRecordsByType: (recordType) =>
    api.get(`/medical-records/type/${recordType}`),
  createRecord: (data) => api.post("/medical-records", data),
  updateRecord: (id, data) => api.put(`/medical-records/${id}`, data),
  deleteRecord: (id) => api.delete(`/medical-records/${id}`),
  addDocument: (recordId, data) =>
    api.post(`/medical-records/${recordId}/documents`, data),
};

// Professional API
export const professionalAPI = {
  getAll: (params) => api.get("/professionals", { params }),
  getById: (id) => api.get(`/professionals/${id}`),
  getProfile: () => api.get("/professionals/profile"),
  updateProfile: (data) => api.put("/professionals/profile", data),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread/count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read/all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Reminder API
export const reminderAPI = {
  createReminder: (data) => api.post("/reminders", data),
  getReminders: () => api.get("/reminders"),
  getUpcomingReminders: () => api.get("/reminders/upcoming"),
  updateReminder: (id, data) => api.put(`/reminders/${id}`, data),
  completeReminder: (id) => api.put(`/reminders/${id}/complete`),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
};

// Consent API
export const consentAPI = {
  requestConsent: (data) => api.post("/consents/request", data),
  getPendingRequests: () => api.get("/consents/pending"),
  getConsents: () => api.get("/consents"),
  getMyConsents: () => api.get("/consents/my"),
  approveConsent: (id) => api.put(`/consents/${id}/approve`),
  rejectConsent: (id, data) => api.put(`/consents/${id}/reject`, data),
  revokeConsent: (id) => api.delete(`/consents/${id}`),
};

export default api;
