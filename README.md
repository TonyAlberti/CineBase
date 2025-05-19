# CineBase

CineBase is a fullstack movie recommendation app built with **React**, **Tailwind CSS**, **Zustand**, and **Vite** on the frontend, and **Go**, **Fiber**, and **GraphQL** on the backend. It uses the **OMDb API** as a source of movie data.

---

## Features

- 🔐 User authentication (signup/login)
- 🎞️ Movie search by title
- 📊 Ratings from users and critics
- 🎲 "What should I watch?" feature with genre-based random picks
- 📚 Movie details: poster, synopsis, release date, ratings, and genres

---

## Project structure

CineBase/
├── front_end/ → React + Vite + Zustand + Tailwind
└── back_end/ → Go + Fiber + GraphQL

---

## How to run locally

### Requirements

- [Node.js](https://nodejs.org/) and `npm`
- [Go](https://golang.org/) 1.20+
- OMDb API key (get it at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))

---

### Frontend

bash
cd front_end
npm install
npm run dev
Access: http://localhost:5173

### Backend

cd back_end
go run main.go
GraphQL endpoint: http://localhost:8080/graphql

.env in front_end/
env
Copiar
Editar
VITE_BACKEND_URL=http://localhost:8080/graphql

.env in back_end/
env
Copiar
Editar
OMDB_API_KEY=your_api_key_here
