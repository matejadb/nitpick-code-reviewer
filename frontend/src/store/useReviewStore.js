import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useReviewStore = create((set) => ({
  isSubmitting: false,

  reviewResult: {},

  submitCode: async (code) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/review", { code });

      set({ reviewResult: res.data });
    } catch (error) {
      console.log(`Error in submitCode: ${error.message}`);
      throw new Error(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
