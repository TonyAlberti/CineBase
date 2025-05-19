// src/App.tsx
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

// Páginas

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import OQueDevoAssistir from "./pages/OQueDevoAssistir";

export default function App() {
  return (
    <Routes>
      {/* Todas as páginas compartilham o Layout com MenuLateral */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />

        <Route path="o-que-devo-assistir" element={<OQueDevoAssistir />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
