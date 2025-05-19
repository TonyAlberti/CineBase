import { Home, LogIn, Shuffle } from "lucide-react";
import { NavLink } from "react-router-dom";

// Componente do menu lateral colapsável
export default function MenuLateral() {
  // Lista de itens do menu com seus caminhos, nomes e ícones
  const itens = [
    { caminho: "/", nome: "Início", icone: <Home size={20} /> },
    {
      caminho: "/o-que-devo-assistir",
      nome: "O que devo assistir?",
      icone: <Shuffle size={20} />,
    },
    { caminho: "/login", nome: "Login", icone: <LogIn size={20} /> },
  ];

  return (
    <aside className="group bg-neutral-900 text-white w-16 hover:w-64 transition-all duration-300 min-h-screen p-4 flex flex-col gap-4 fixed left-0 top-0 z-50 overflow-hidden">
      {/* Título aparece somente quando o menu é expandido com hover */}
      <h1 className="text-xl font-bold mb-6 text-blue-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
        🎬 CineBase
      </h1>

      {/* Navegação com os links do menu */}
      <nav className="flex flex-col gap-2">
        {itens.map((item) => (
          <NavLink
            key={item.caminho}
            to={item.caminho}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300
              ${isActive ? "bg-blue-500 text-white" : "hover:bg-neutral-800"}`
            }
          >
            {/* Ícone dentro de um círculo (destaque se ativo) */}
            <div
              className={`
                w-8 h-8 flex items-center justify-center rounded-full transition
                ${location.pathname === item.caminho ? "bg-white/20" : ""}
              `}
            >
              {item.icone}
            </div>

            {/* Nome do item só aparece ao passar o mouse no menu */}
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300 text-sm">
              {item.nome}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
