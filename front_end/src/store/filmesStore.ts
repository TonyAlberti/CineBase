import { create } from "zustand";

// Tipo que representa um filme
type Filme = {
  id: string;
  titulo: string;
  sinopse: string;
  posterUrl: string;
  lancamento: string;
  generos: string[];
  notaUsuario: number;
  notaCritica: number;
};

// Estado do store Zustand para filmes
type EstadoFilmes = {
  carregando: boolean;
  filmesRecentes: Filme[];
  melhoresUsuarios: Filme[];
  melhoresCriticos: Filme[];
  amadosPorTodos: Filme[];

  todosFilmes: Filme[]; //  todos os filmes disponíveis
  setTodosFilmes: (filmes: Filme[]) => void; // atualiza todos os filmes

  setCarregando: (valor: boolean) => void;
  setFilmesRecentes: (filmes: Filme[]) => void;
  setMelhoresUsuarios: (filmes: Filme[]) => void;
  setMelhoresCriticos: (filmes: Filme[]) => void;
  setAmadosPorTodos: (filmes: Filme[]) => void;
};

export const useFilmeStore = create<EstadoFilmes>((set) => ({
  carregando: false,
  filmesRecentes: [],
  melhoresUsuarios: [],
  melhoresCriticos: [],
  amadosPorTodos: [],
  todosFilmes: [],

  setCarregando: (valor) => set({ carregando: valor }),
  setFilmesRecentes: (filmes) => set({ filmesRecentes: filmes }),
  setMelhoresUsuarios: (filmes) => set({ melhoresUsuarios: filmes }),
  setMelhoresCriticos: (filmes) => set({ melhoresCriticos: filmes }),
  setAmadosPorTodos: (filmes) => set({ amadosPorTodos: filmes }),
  setTodosFilmes: (filmes) => set({ todosFilmes: filmes }),
}));
