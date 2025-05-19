import { create } from "zustand";

// Interface com os estados globais da UI
interface EstadoUI {
  carregandoGlobalmente: boolean; // Exibe spinner de carregamento geral
  modalAberto: boolean; // Define se algum modal está aberto

  // Funções para manipular os estados
  setCarregando: (valor: boolean) => void;
  setModalAberto: (valor: boolean) => void;
}

// Criação do store global para controle da interface
export const useUIStore = create<EstadoUI>((set) => ({
  // Estado inicial
  carregandoGlobalmente: false,
  modalAberto: false,

  // Altera o estado de carregamento
  setCarregando: (valor) => set({ carregandoGlobalmente: valor }),

  // Altera o estado de modal aberto
  setModalAberto: (valor) => set({ modalAberto: valor }),
}));
