import { GraphQLClient } from "graphql-request";

// Cria uma instância do client com o cabeçalho correto
const client = new GraphQLClient(import.meta.env.VITE_API_URL, {
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
