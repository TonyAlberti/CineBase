import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buscarTodosFilmes } from "../services/filmesAPI";
import { useFilmeStore } from "../store/filmesStore";
import { useGeneroStore } from "../store/generoStore";
import { Filme } from "../types/Filme";

// Gêneros disponíveis para o usuário selecionar
const generosDisponiveis = [
  { label: "Ação", valor: "action" },
  { label: "Comédia", valor: "comedy" },
  { label: "Drama", valor: "drama" },
  { label: "Ficção", valor: "sci-fi" },
  { label: "Terror", valor: "horror" },
  { label: "Mistério", valor: "mystery" },
  { label: "Romance", valor: "romance" },
  { label: "Suspense", valor: "thriller" },
];

export default function OQueDevoAssistir() {
  const { todosFilmes, setTodosFilmes } = useFilmeStore();
  const { generosSelecionados, adicionarGenero, removerGenero } =
    useGeneroStore();

  const [filmesSorteados, setFilmesSorteados] = useState<Filme[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null); // ID do card expandido

  // Carrega todos os filmes ao montar o componente
  useEffect(() => {
    async function carregar() {
      const filmes = await buscarTodosFilmes();
      setTodosFilmes(filmes);
    }
    carregar();
  }, []);

  // Alterna seleção de um gênero
  function alternarGenero(valor: string) {
    if (generosSelecionados.includes(valor)) removerGenero(valor);
    else adicionarGenero(valor);
  }

  // Sorteia até 5 filmes que mais combinam com os gêneros escolhidos
  function sortearFilmes() {
    const ranqueados = [...todosFilmes]
      .map((filme) => ({
        filme,
        pontos: filme.generos
          .map(
            (g) =>
              g
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          )
          .filter((g) => generosSelecionados.includes(g)).length, // Pontuação por gênero em comum
      }))
      .filter((item) => item.pontos > 0) // Remove os que não combinam com nenhum
      .sort((a, b) => b.pontos - a.pontos) // Ordena por pontuação
      .slice(0, 5) // Pega no máximo 5
      .map((item) => item.filme); // Extrai o filme

    setFilmesSorteados(ranqueados);
    setExpandido(null); // Fecha todos os cards
  }

  return (
    <div className="text-white px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🎯 O que devo assistir?</h1>

      {/* Botões de seleção de gêneros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {generosDisponiveis.map(({ label, valor }) => (
          <button
            key={valor}
            onClick={() => alternarGenero(valor)}
            className={`px-4 py-2 rounded-full border transition ${
              generosSelecionados.includes(valor)
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Botão de sortear os filmes */}
      <button
        onClick={sortearFilmes}
        disabled={generosSelecionados.length === 0} // Só permite se ao menos 1 gênero estiver selecionado
        className="mb-8 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40"
      >
        Sortear Filmes 🎲
      </button>

      {/* Exibição dos filmes sorteados em efeito "cards" (Swiper) */}
      {filmesSorteados.length > 0 && (
        <div className="max-w-md mx-auto">
          <Swiper effect="cards" grabCursor modules={[EffectCards]}>
            {filmesSorteados.map((filme) => (
              <SwiperSlide key={filme.id}>
                <motion.div
                  className={`rounded-xl bg-neutral-900 text-white shadow-md overflow-hidden transition-all duration-300 cursor-pointer flex flex-col ${
                    expandido === filme.id ? "h-[600px]" : "h-[480px]"
                  }`}
                  onClick={() =>
                    setExpandido((id) => (id === filme.id ? null : filme.id))
                  } // Expande ou recolhe o card ao clicar
                >
                  {/* Imagem do pôster centralizada */}
                  <div className="h-80 flex items-center justify-center p-2">
                    <img
                      src={filme.posterUrl}
                      alt={filme.titulo}
                      className="max-h-full object-contain"
                    />
                  </div>

                  {/* Detalhes do filme (visíveis apenas se expandido) */}
                  <div className="p-4 flex-1 overflow-y-auto">
                    <h2 className="text-lg font-bold">{filme.titulo}</h2>

                    {expandido === filme.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm mt-2 space-y-2"
                      >
                        <p className="text-gray-300">{filme.sinopse}</p>
                        <p className="text-yellow-400">
                          ⭐ {filme.notaUsuario} IMDb
                        </p>
                        <p className="text-pink-400">
                          🎯 {filme.notaCritica} Metascore
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
