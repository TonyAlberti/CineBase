import { create } from "zustand";

interface AuthState {
  token: string | null;
  email: string | null;
  nome: string | null;
  autenticado: boolean;
  fazerLogin: (nome: string, email: string, token: string) => void;
  fazerLogout: () => void;
  carregarDeLocalStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  nome: null,
  autenticado: false,

  // Salva dados no Zustand e localStorage
  fazerLogin: (nome, email, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("nome", nome);
    set({ token, email, nome, autenticado: true });
  },

  // Limpa dados
  fazerLogout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nome");
    set({ token: null, email: null, nome: null, autenticado: false });
  },

  // Carrega estado persistido
  carregarDeLocalStorage: () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const nome = localStorage.getItem("nome");
    if (token && email && nome) {
      set({ token, email, nome, autenticado: true });
    }
  },
}));
