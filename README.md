# 🎬 CineBase

O **CineBase** é uma plataforma de filmes desenvolvida com **React**, **Tailwind CSS** e **Go com Fiber + GraphQL**, que permite explorar, visualizar e descobrir novos filmes de forma organizada e interativa. O sistema se conecta à API do **OMDb** para exibir os filmes com base em avaliações e preferências do usuário.

---

## ✨ Funcionalidades

- 🔍 **Busca de filmes** por título
- 📊 Classificação dos filmes em três categorias:
  - Melhores avaliados pelos **usuários**
  - Melhores avaliados pela **crítica**
  - Filmes **aclamados por todos** (bem avaliados por ambos)
- 🎲 Página “**O que devo assistir?**”
  - Usuário escolhe um ou mais gêneros
  - Um sorteio exibe 5 sugestões baseadas na escolha
- 🔐 **Autenticação completa**
  - Cadastro, login, logout
  - Avatar com as iniciais do usuário logado
- 🎨 Interface moderna e responsiva 
- 🧠 Armazenamento de estado global com **Zustand**

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- [React]
- [TypeScript]
- [Tailwind CSS]
- Zustand (gerenciamento de estado)
- Framer Motion (animações)
- Swiper.js (carrosséis e efeitos)
- GraphQL Request (consumo da API)

### Back-end
- [Go (Golang)]
- [Fiber] (framework web leve e rápido)
- GraphQL com `graphql-go`
- OMDb API como fonte externa de dados

