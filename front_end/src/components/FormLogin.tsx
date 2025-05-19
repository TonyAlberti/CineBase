import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { realizarCadastro, realizarLogin } from "../services/authAPI";
import { useAuthStore } from "../store/authStore";

export default function FormLogin() {
  const [modoLogin, setModoLogin] = useState(false); // Define se está no modo login (true) ou cadastro (false)
  const [nome, setNome] = useState(""); // Campo do nome (usado no cadastro)
  const [email, setEmail] = useState(""); // Campo de email
  const [senha, setSenha] = useState(""); // Campo de senha
  const [erro, setErro] = useState(""); // Exibe mensagem de erro

  const fazerLogin = useAuthStore((s) => s.fazerLogin); // Ação global para logar no Zustand
  const navigate = useNavigate(); // Redireciona após login/cadastro

  // Envia os dados do formulário
  async function lidarComSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      if (modoLogin) {
        const dados = await realizarLogin(email, senha); // Tenta fazer login
        fazerLogin(dados.nome, dados.email, dados.token);
      } else {
        const dados = await realizarCadastro(nome, email, senha); // Tenta fazer cadastro
        fazerLogin(dados.nome, dados.email, dados.token);
      }

      navigate("/"); // Redireciona para home
    } catch (err: any) {
      setErro(err.message || "Erro inesperado"); // Exibe erro caso falhe
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="relative w-[900px] h-[550px] bg-zinc-900 rounded-[2rem] overflow-hidden shadow-xl flex">
        {/* Painel lateral com mensagem e botão para alternar modo */}
        <motion.div
          animate={{ x: modoLogin ? "100%" : "0%" }} // Move o painel com base no modo
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex flex-col items-center justify-center p-8 z-20 rounded-[2rem]"
        >
          <h2 className="text-3xl font-bold mb-3">
            {modoLogin ? "Olá, amigo!" : "Bem-vindo!"}
          </h2>
          <p className="text-sm text-center mb-6 px-2 leading-relaxed">
            {modoLogin
              ? "Crie sua conta para aproveitar todos os recursos do site."
              : "Já possui uma conta? Faça login para continuar."}
          </p>
          <button
            onClick={() => setModoLogin(!modoLogin)} // Alterna entre login e cadastro
            className="px-6 py-2 bg-white text-zinc-800 rounded-full hover:opacity-90 transition"
          >
            {modoLogin ? "Cadastrar" : "Login"}
          </button>
        </motion.div>

        {/* Formulário animado (movimenta para esquerda junto com o painel) */}
        <motion.form
          onSubmit={lidarComSubmit}
          animate={{ x: modoLogin ? "-100%" : "0%" }} // Move a área do formulário
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 w-1/2 h-full bg-zinc-800 text-white px-10 py-12 flex flex-col justify-center items-center space-y-6 z-10 rounded-r-[2rem]"
        >
          <h2 className="text-2xl font-semibold">
            {modoLogin ? "Entrar" : "Criar Conta"}
          </h2>

          {/* Campo do nome só aparece no modo cadastro */}
          {!modoLogin && (
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-700 rounded-md focus:outline-none"
            />
          )}

          {/* Campo de e-mail */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-zinc-700 rounded-md focus:outline-none"
          />

          {/* Campo de senha */}
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full px-4 py-2 bg-zinc-700 rounded-md focus:outline-none"
          />

          {/* Exibe mensagem de erro se houver */}
          {erro && (
            <p className="text-red-400 text-sm -mt-3 text-center">{erro}</p>
          )}

          {/* Botão de envio do formulário */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md hover:opacity-90"
          >
            {modoLogin ? "Entrar" : "Cadastrar"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
