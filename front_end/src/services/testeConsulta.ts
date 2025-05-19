import { gql } from "graphql-request";
import client from "./graphqlClient";

// Consulta GraphQL de teste
const query = gql`
  query {
    recentMovies {
      id
      title
      synopsis
    }
  }
`;

// Função para testar requisição ao back-end
export async function testarConsulta() {
  try {
    const data = await client.request(query);
    console.log("🎬 Filmes recebidos do back-end:", data);
  } catch (erro) {
    console.error("❌ Erro ao buscar filmes:", erro);
  }
}
