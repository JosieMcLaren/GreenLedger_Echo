import { create } from "zustand";
export const useEUFigStore = create((set) => ({
  minFrom: null,
  maxTo: null,
  loading: false,
  error: null,
  fetchYearRange: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/EU/eudatafig");
      const { minFrom, maxTo } = await res.json();
      set({ minFrom, maxTo, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch year range", loading: false });
    }
  },
}));
