import { Outlet } from "react-router-dom";
import AvatarUsuario from "./AvatarUsuario";
import MenuLateral from "./MenuLateral";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white relative">
      {/* Menu lateral fixo à esquerda */}
      <MenuLateral />

      {/* Avatar do usuário no canto superior direito */}
      <AvatarUsuario />

      {/* Área principal onde as páginas são renderizadas */}
      <main className="flex-1 p-6 overflow-y-auto ml-16">
        <Outlet /> {/* Renderiza o conteúdo da rota atual */}
      </main>
    </div>
  );
}
