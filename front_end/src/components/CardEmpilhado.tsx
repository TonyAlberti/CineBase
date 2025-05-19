import { motion } from "framer-motion";
import { useState } from "react";
import { Filme } from "../types/Filme";

interface Props {
  filmes: Filme[];
}

export default function CardEmpilhado({ filmes }: Props) {
  const [indiceAtual, setIndiceAtual] = useState(0); // Índice do card visível no topo

  // Avança para o próximo card da pilha
  const proximo = () => {
    if (indiceAtual < filmes.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  return (
    <div className="relative w-[300px] h-[460px]">
      {/* Mapeia todos os filmes, posicionando-os em "camadas" */}
      {filmes.map((filme, index) => {
        const ativo = index === indiceAtual; // Card atual no topo
        const atrasado = index < indiceAtual; // Cartas já viradas

        return (
          <motion.div
            key={filme.id}
            className="absolute w-full h-full rounded-xl overflow-hidden shadow-lg cursor-pointer bg-zinc-900"
            style={{ zIndex: filmes.length - index }} // Controla empilhamento visual
            initial={{ scale: 0.9, y: 20, opacity: 0 }} // Animação inicial
            animate={{
              scale: ativo ? 1 : 0.95, // Card ativo = escala 1
              y: ativo ? 0 : 10 * (index - indiceAtual), // Cartas de fundo deslocadas levemente
              opacity: atrasado ? 0 : 1, // Oculta cartas anteriores
            }}
            transition={{ duration: 0.4, type: "spring" }}
            onClick={ativo ? proximo : undefined} // Só permite clicar no card do topo
          >
            {/* Imagem de pôster ocupa 2/3 do card */}
            <img
              src={filme.posterUrl}
              alt={filme.titulo}
              className="w-full h-2/3 object-cover"
            />

            {/* Informações na parte inferior do card */}
            <div className="p-4 text-white h-1/3 flex flex-col justify-between">
              <h3 className="text-lg font-bold truncate">{filme.titulo}</h3>
              <p className="text-sm text-gray-300 line-clamp-4">
                {filme.sinopse}
              </p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-yellow-400">⭐ {filme.notaUsuario}</span>
                <span className="text-pink-400">🎯 {filme.notaCritica}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
