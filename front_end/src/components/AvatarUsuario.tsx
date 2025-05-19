import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AvatarUsuario() {
  // Estado global de autenticação
  const { email, fazerLogout, carregarDeLocalStorage } = useAuthStore();

  // Controla se o menu dropdown está aberto
  const [aberto, setAberto] = useState(false);

  // Referência para o botão/avatar (usado para detectar clique fora)
  const avatarRef = useRef<HTMLDivElement>(null);

  // Hook para redirecionamento de rota
  const navigate = useNavigate();

  // Ao montar o componente, carrega dados do localStorage (token/email)
  useEffect(() => {
    carregarDeLocalStorage();
  }, []);

  // Fecha o menu se clicar fora do avatar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler); // Limpa o event listener
  }, []);

  // Se não estiver logado, não exibe nada
  if (!email) return null;

  // Extrai as iniciais do email (ex: "tony.alberti" → "TA")
  const iniciais = email
    .split("@")[0]
    .split(" ")
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  // Função de logout: limpa estado e redireciona para login
  function sair() {
    fazerLogout();
    navigate("/login");
  }

  return (
    <div
      ref={avatarRef}
      className="fixed top-4 right-4 z-50 flex flex-col items-end"
    >
      {/* Botão redondo com as iniciais */}
      <button
        onClick={() => setAberto((prev) => !prev)} // Alterna visibilidade do menu
        className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:opacity-90 transition"
        title="Abrir menu"
      >
        {iniciais}
      </button>

      {/* Menu dropdown com email e botão de sair */}
      {aberto && (
        <div className="mt-2 w-40 bg-zinc-800 text-white rounded-md shadow-lg p-2 text-sm animate-fade-in">
          <p className="mb-2 text-gray-300">{email}</p>
          <button
            onClick={sair}
            className="w-full text-left px-3 py-2 rounded hover:bg-zinc-700 transition"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
