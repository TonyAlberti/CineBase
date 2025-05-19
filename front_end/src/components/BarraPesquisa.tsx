import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useFilmeStore } from "../store/filmesStore";
import CardFilme from "./CardFilme";

export default function BarraPesquisa() {
  const [visivel, setVisivel] = useState(false); // Controla se a barra de busca está visível
  const [busca, setBusca] = useState(""); // Estado do texto digitado
  const { filmesRecentes } = useFilmeStore(); // Lista vinda do Zustand

  // Filtra os filmes com base na busca (case-insensitive)
  const resultados = filmesRecentes.filter((filme) =>
    filme.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="relative z-20 flex flex-col items-start w-full px-4">
      {/* Botão com ícone de lupa */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setVisivel((v) => !v)} // Alterna a exibição do campo de busca
          className="text-white text-lg p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
        >
          <FaSearch />
        </button>

        {/* Campo de input animado (só aparece quando visível = true) */}
        <AnimatePresence>
          {visivel && (
            <motion.input
              key="input-busca"
              initial={{ width: 0, opacity: 0 }} // Começa invisível
              animate={{ width: "100%", opacity: 1 }} // Anima para expandir e aparecer
              exit={{ width: 0, opacity: 0 }} // Anima ao sumir
              transition={{ duration: 0.4 }}
              type="text"
              placeholder="Buscar filme..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)} // Atualiza o estado da busca
              className="max-w-md bg-zinc-900 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none border border-zinc-700 focus:border-blue-500"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Resultados da busca (só aparecem se tiver texto suficiente e resultados) */}
      <AnimatePresence>
        {visivel && busca.length > 1 && resultados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} // Anima entrada suave
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex gap-4 flex-wrap"
          >
            {/* Exibe cada filme encontrado como um card */}
            {resultados.map((filme) => (
              <CardFilme key={filme.id} filme={filme} />
            ))}
          </motion.div>
        )}

        {/* Mensagem se nenhum resultado for encontrado */}
        {visivel && busca.length > 1 && resultados.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-zinc-400"
          >
            Nenhum filme encontrado. 😓
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
