import { create } from "zustand";

type AuthState = {
  name: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
  login: (name: string, email: string, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  name: "",
  email: "",
  token: "",
  isLoggedIn: false,
  login: (name, email, token) => set({ name, email, token, isLoggedIn: true }),
  logout: () => set({ name: "", email: "", token: "", isLoggedIn: false }),
}));
