import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import { Filme } from "../types/Filme";

interface Props {
  filme: Filme;
}

export default function CardFilme({ filme }: Props) {
  const [aberto, setAberto] = useState(false); // Controla se o modal está aberto

  return (
    <>
      {/* Card compacto padrão (imagem + título + notas) */}
      <motion.div
        className="w-[170px] min-w-[170px] h-[300px] rounded-xl overflow-hidden bg-zinc-900 shadow-md cursor-pointer"
        whileHover={{ scale: 1.05 }} // Efeito de zoom ao passar o mouse
        onClick={() => setAberto(true)} // Abre modal ao clicar
      >
        <img
          src={filme.posterUrl}
          alt={filme.titulo}
          className="w-full h-full object-cover"
        />
        {/* Rodapé escuro com título e notas */}
        <div className="absolute bottom-0 w-full bg-black/70 px-3 py-2">
          <h3 className="text-sm font-semibold text-white truncate">
            {filme.titulo}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-white">
            <span className="flex items-center gap-1 text-yellow-400">
              <FaStar className="text-[10px]" /> {filme.notaUsuario}
            </span>
            <span className="flex items-center gap-1 text-pink-400">
              <FaClock className="text-[10px]" /> {filme.notaCritica}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal de detalhes do filme (expandido) */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAberto(false)} // Fecha o modal ao clicar fora
          >
            <motion.div
              className="bg-zinc-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar dentro do modal
            >
              {/* Pôster em tamanho maior */}
              <img
                src={filme.posterUrl}
                alt={filme.titulo}
                className="w-full h-96 object-contain rounded-t-xl"
              />

              {/* Conteúdo textual do modal */}
              <div className="p-4 text-white">
                <h2 className="text-lg font-bold mb-2">{filme.titulo}</h2>
                <p className="text-sm mb-4">{filme.sinopse}</p>

                {/* Notas exibidas lado a lado */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <FaStar className="text-xs" /> {filme.notaUsuario}
                  </span>
                  <span className="flex items-center gap-1 text-pink-400">
                    <FaClock className="text-xs" /> {filme.notaCritica}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
