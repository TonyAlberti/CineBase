import { gql } from "graphql-request";
import { Filme } from "../types/Filme";
import client from "./graphqlClient";

// Tipo dos dados recebidos do back-end (com os nomes reais)
type FilmeAPI = {
  id: string;
  title: string;
  synopsis: string;
  poster_url: string;
  released: string;
  genres: string[];
  user_rating: number;
  critic_rating: number;
};

// Tipo da resposta da nova query
type RespostaAPI = {
  allMovies: FilmeAPI[];
};

// Converte os campos do back-end para o padrão do front-end
const mapear = (f: FilmeAPI): Filme => ({
  id: f.id,
  titulo: f.title,
  sinopse: f.synopsis,
  posterUrl: f.poster_url,
  lancamento: f.released,
  generos: f.genres,
  notaUsuario: f.user_rating,
  notaCritica: f.critic_rating,
});

// Query GraphQL que busca todos os filmes
const QUERY_TODOS_OS_FILMES = gql`
  query {
    allMovies {
      id
      title
      synopsis
      poster_url
      released
      genres
      user_rating
      critic_rating
    }
  }
`;

// Função que busca todos os filmes e converte para uso no front
export async function buscarTodosFilmes(): Promise<Filme[]> {
  const data = await client.request<RespostaAPI>(QUERY_TODOS_OS_FILMES);
  return data.allMovies.map(mapear);
}
