import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useReviewStore = create((set, get) => ({
  isSubmitting: false,
  code: "",
  reviewResult: {},
  isViewingHistory: false,
  reviewHistory: [],
  language: "javascript",

  submitCode: async (code, language) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/review", { code, language });

      set({
        reviewResult: res.data,
        reviewHistory: [res.data, ...get().reviewHistory],
        isViewingHistory: true,
      });
    } catch (error) {
      console.log(`Error in submitCode: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchReviews: async () => {
    try {
      const res = await axiosInstance.get("/review");

      set({ reviewHistory: res.data });
    } catch (error) {
      console.log(`Error in fetchReviews: ${error.message}`);
      throw new Error(error);
    }
  },

  selectReview: (review) => {
    set({
      reviewResult: review,
      code: review.submittedCode,
      isViewingHistory: true,
      language: review.language || "javascript",
    });
  },

  setCode: (code) => {
    set({ code });
  },

  resetReview: () => {
    set({
      code: "",
      reviewResult: {},
      isViewingHistory: false,
      language: "javascript",
    });
  },

  setLanguage: (language) => {
    set({ language });
  },
}));
