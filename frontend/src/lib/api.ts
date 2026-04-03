import axios from "axios";
import { Feedback } from "../types/feedback";

// Base API URL - dynamic for Docker support, falls back to local setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Public: Submit new feedback
 */
export const submitFeedback = async (data: Partial<Feedback>) => {
  const response = await api.post("/feedback", data);
  return response.data;
};

/**
 * Admin: Login to get a token
 */
export const adminLogin = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

/**
 * Admin: Get all feedback with filters and search
 */
export const getFeedbacks = async (
  token: string, 
  params: { category?: string; status?: string; search?: string; page?: number } = {}
) => {
  const response = await api.get("/feedback", {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

/**
 * Admin: Get single feedback by ID
 */
export const getFeedbackById = async (token: string, id: string) => {
  const response = await api.get(`/feedback/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Admin: Update feedback status
 */
export const updateFeedback = async (
  token: string, 
  id: string, 
  data: { status: string }
) => {
  const response = await api.patch(`/feedback/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Admin: Delete feedback
 */
export const deleteFeedback = async (token: string, id: string) => {
  const response = await api.delete(`/feedback/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Admin: Re-trigger AI analysis
 */
export const reAnalyzeFeedback = async (token: string, id: string) => {
  const response = await api.post(`/feedback/${id}/analyze`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Admin: Get Dashboard Stats
 */
export const getStats = async (token: string) => {
  const response = await api.get("/feedback/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Admin: Get AI Summary
 */
export const getSummary = async (token: string) => {
  const response = await api.get("/feedback/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
