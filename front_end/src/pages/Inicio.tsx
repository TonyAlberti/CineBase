import { motion } from "framer-motion";
import { useEffect } from "react";

import BannerFilme from "../components/BannerFilme";
import BarraPesquisa from "../components/BarraPesquisa";
import CarrosselFilmes from "../components/CarrosselFilmes";

import { buscarTodosFilmes } from "../services/filmesAPI";
import { useFilmeStore } from "../store/filmesStore";
import { Filme } from "../types/Filme";

export default function Inicio() {
  // Ações e estados globais do store
  const {
    setCarregando,
    setFilmesRecentes,
    setMelhoresUsuarios,
    setMelhoresCriticos,
    filmesRecentes,
    melhoresUsuarios,
    melhoresCriticos,
  } = useFilmeStore();

  // Carrega os filmes ao montar o componente
  useEffect(() => {
    async function carregarFilmes() {
      setCarregando(true);
      try {
        const todos: Filme[] = await buscarTodosFilmes(); // Busca todos os filmes

        // Define os 10 primeiros como "recentes"
        setFilmesRecentes(todos.slice(0, 10));

        // Ordena e define os 10 melhores por nota de usuários
        const ordenadoPorUsuarios = [...todos].sort(
          (a, b) => b.notaUsuario - a.notaUsuario
        );

        // Ordena e define os 10 melhores por nota da crítica
        const ordenadoPorCriticos = [...todos].sort(
          (a, b) => b.notaCritica - a.notaCritica
        );

        setMelhoresUsuarios(ordenadoPorUsuarios.slice(0, 10));
        setMelhoresCriticos(ordenadoPorCriticos.slice(0, 10));
      } catch (erro) {
        console.error("Erro ao buscar filmes do back-end:", erro);
      } finally {
        setCarregando(false); // Encerra o estado de carregamento
      }
    }

    carregarFilmes();
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-12 max-h-screen overflow-y-scroll scrollbar-hide px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔍 Barra de busca com animação de entrada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <BarraPesquisa />
      </motion.div>

      {/* 🎬 Banner com destaque visual (apenas se houver filmes) */}
      {filmesRecentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <BannerFilme filmes={filmesRecentes} />
        </motion.div>
      )}

      {/* 📽️ Carrossel com lançamentos recentes */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <CarrosselFilmes
          titulo="Lançamentos Recentes"
          filmes={filmesRecentes}
        />
      </motion.div>

      {/* ⭐ Carrossel com melhores pelos usuários */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <CarrosselFilmes
          titulo="Melhores Avaliados pelos Usuários"
          filmes={melhoresUsuarios}
        />
      </motion.div>

      {/* 🎯 Carrossel com melhores pelos críticos */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <CarrosselFilmes
          titulo="Melhores Avaliados pelos Críticos"
          filmes={melhoresCriticos}
        />
      </motion.div>
    </motion.div>
  );
}
