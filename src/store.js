import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  isAuth: false,

  setUser: (user) => set({ user: user, isAuth: true }),

  logout: () => set({ user: null, isAuth: false }),
}));
