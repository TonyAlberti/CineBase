import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Filme } from "../types/Filme";
import CardFilme from "./CardFilme";

interface PropsCarrossel {
  titulo: string;
  filmes: Filme[];
}

export default function CarrosselFilmes({ titulo, filmes }: PropsCarrossel) {
  const ref = useRef<HTMLDivElement>(null); // Referência para o container do carrossel

  // Função para rolar horizontalmente para esquerda ou direita
  const scroll = (direcao: "esquerda" | "direita") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8; // 80% da largura visível
      ref.current.scrollBy({
        left: direcao === "direita" ? scrollAmount : -scrollAmount,
        behavior: "smooth", // Rola suavemente
      });
    }
  };

  return (
    <section className="mb-12 relative">
      {/* Título da seção */}
      <h2 className="text-2xl font-bold text-white mb-4">{titulo}</h2>

      <div className="relative">
        {/* Botão de rolar para a esquerda */}
        <button
          onClick={() => scroll("esquerda")}
          className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Lista horizontal de cards com overflow */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
          style={{ scrollbarWidth: "none" }} // Esconde a barra no Firefox
        >
          {filmes.map((filme) => (
            <CardFilme key={filme.id} filme={filme} /> // Renderiza cada card
          ))}
        </div>

        {/* Botão de rolar para a direita */}
        <button
          onClick={() => scroll("direita")}
          className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2"
        >
          <ChevronRight size={20} />
        </button>

        {/* Animação de entrada da seção (incompleta, mas presente) */}
        <motion.section
          className="mb-12 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }} // Ativa ao aparecer 30% do elemento
        ></motion.section>
      </div>
    </section>
  );
}
