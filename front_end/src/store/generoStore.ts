import { create } from "zustand";

// Tipo que define o estado da store de gêneros
type GeneroStore = {
  // Lista de gêneros selecionados pelo usuário (ex: ["Ação", "Comédia"])
  generosSelecionados: string[];
  // Adiciona um gênero à lista
  adicionarGenero: (genero: string) => void;
  // Remove um gênero da lista
  removerGenero: (genero: string) => void;
  // Limpa todos os gêneros selecionados
  limparGeneros: () => void;
};

// Criação da store usando Zustand
export const useGeneroStore = create<GeneroStore>((set, get) => ({
  generosSelecionados: [],

  adicionarGenero: (genero) => {
    const { generosSelecionados } = get();

    // Se o gênero já estiver selecionado, não adiciona novamente
    if (!generosSelecionados.includes(genero)) {
      set({ generosSelecionados: [...generosSelecionados, genero] });
    }
  },

  removerGenero: (genero) => {
    const { generosSelecionados } = get();

    // Remove o gênero da lista filtrando o que for diferente
    set({
      generosSelecionados: generosSelecionados.filter((g) => g !== genero),
    });
  },

  limparGeneros: () => {
    // Limpa completamente a lista de gêneros
    set({ generosSelecionados: [] });
  },
}));
