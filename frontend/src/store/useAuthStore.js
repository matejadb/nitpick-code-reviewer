import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useReviewStore } from "./useReviewStore.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
  isSendingResetLink: false,
  isResettingPassword: false,

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
      toast.success(`Email verified! You can now log in.`);
    } catch (error) {
      console.log(`error in verifyEmail: ${error.message}`);
      toast.error(`${error.response.data.message}`);
    }
  },

  register: async (data) => {
    set({ isRegistering: true });

    try {
      await axiosInstance.post("/auth/register", data);
      toast.success(`Verification link sent! Please check your email.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(`Error in register: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success(`Logged in successfully.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(`Error in login: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      useReviewStore.getState().resetReview();
      set({ authUser: null });
      toast.success(`Logged out successfully.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(`Error in logout: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingResetLink: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(`Successfully sent a reset link.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(`Error in forgotPassword: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isSendingResetLink: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post(`/auth/reset-password?token=${token}`, {
        newPassword,
      });
      toast.success(`Password reset! You can now log in.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(`Error in resetPassword: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
