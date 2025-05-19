import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Filme } from "../types/Filme";

// Componente visual de banner com destaque cinematográfico
export default function BannerFilme({ filmes }: { filmes: Filme[] }) {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]} // Ativa autoplay e paginação
        slidesPerView={1} // Exibe um slide por vez
        loop // Loop infinito
        autoplay={{ delay: 6000, disableOnInteraction: false }} // Tempo de exibição de cada slide
        pagination={{ clickable: true }} // Paginação interativa
        className="w-full"
      >
        {/* Um slide para cada filme */}
        {filmes.map((filme) => (
          <SwiperSlide key={filme.id}>
            <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
              {/* Imagem de fundo com efeito blur e escurecida */}
              <img
                src={filme.posterUrl}
                alt={filme.titulo}
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md scale-110"
              />

              {/* Camada escura sobre a imagem de fundo (gradiente) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

              {/* Área com o conteúdo visível no banner */}
              <div className="relative z-20 flex items-center gap-8 px-16 max-w-7xl mx-auto">
                {/* Poster em alta qualidade no centro */}
                <img
                  src={filme.posterUrl}
                  alt={filme.titulo}
                  className="w-64 rounded-xl shadow-lg object-cover"
                />

                {/* Informações principais do filme */}
                <div className="max-w-xl">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {filme.titulo}
                  </h2>
                  <p className="text-gray-300 mb-4">{filme.sinopse}</p>

                  {/* Notas e gêneros exibidos em linha */}
                  <div className="flex gap-4 text-sm text-white">
                    <span>⭐ {filme.notaUsuario} IMDb</span>
                    <span>🎯 {filme.notaCritica} Metascore</span>
                    <span>🎬 {filme.generos.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
