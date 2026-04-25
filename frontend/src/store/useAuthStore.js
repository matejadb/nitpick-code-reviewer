import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useReviewStore } from "./useReviewStore.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log(`Error in checkAuth: ${error.message}`);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  verifyEmail: async (token) => {
    try {
      await axiosInstance.get(`/auth/verify-email?token=${token}`);
    } catch (error) {
      console.log(`error in verifyEmail: ${error.message}`);
    }
  },

  register: async (data) => {
    set({ isRegistering: true });

    try {
      await axiosInstance.post("/auth/register", data);
    } catch (error) {
      console.log(`Error in register: ${error.message}`);
      throw new Error(error.message);
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log(`Error in login: ${error.message}`);
      throw new Error(error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      useReviewStore.getState().resetReview();
      set({ authUser: null });
    } catch (error) {
      console.log(`Error in logout: ${error.message}`);
    }
  },
}));
