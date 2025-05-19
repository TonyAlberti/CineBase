import { useFilmeStore } from "../store/filmesStore";

// Seção visual destacada de um único filme
export default function DestaqueFilme() {
  const { filmeDestaque } = useFilmeStore(); // Busca o filme em destaque no Zustand

  // Se não houver filme definido, nada é renderizado
  if (!filmeDestaque) return null;

  return (
    <section className="relative w-full h-[420px] rounded-xl overflow-hidden mb-12">
      {/* Imagem de fundo com blur e opacidade reduzida */}
      <img
        src={filmeDestaque.posterUrl}
        alt={filmeDestaque.titulo}
        className="absolute w-full h-full object-cover blur-sm opacity-30"
      />

      {/* Gradiente escuro da esquerda para a direita para melhorar contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      {/* Conteúdo textual do destaque sobre a imagem */}
      <div className="relative z-10 p-10 flex flex-col justify-center h-full text-white max-w-3xl">
        <h2 className="text-4xl font-bold mb-4">{filmeDestaque.titulo}</h2>

        {/* Sinopse com limite de 3 linhas */}
        <p className="text-gray-300 mb-6 line-clamp-3">
          {filmeDestaque.sinopse}
        </p>

        {/* Botões de ação (estáticos no momento) */}
        <div className="flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded font-medium">
            Ver Detalhes
          </button>
          <button className="border border-white px-5 py-2 rounded hover:bg-white hover:text-black transition">
            Assistir depois
          </button>
        </div>
      </div>
    </section>
  );
}
