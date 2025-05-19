import { gql } from "graphql-request";
import client from "./graphqlClient";

//  Mutation GraphQL para login
const MUTATION_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      token
    }
  }
`;

//  Mutation GraphQL para cadastro
const MUTATION_CADASTRO = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      name
      email
    }
  }
`;

// Tipagem da resposta do login
type LoginResposta = {
  login: {
    email: string;
    token: string;
  };
};

// Tipagem da resposta do cadastro
type CadastroResposta = {
  signup: {
    name: string;
    email: string;
  };
};

//  Realiza login via GraphQL (envia email e senha, recebe token e email)
export async function realizarLogin(email: string, password: string) {
  const response = await client.request<LoginResposta>(MUTATION_LOGIN, {
    email,
    password,
  });

  const { token } = response.login;

  return {
    nome: email.split("@")[0], // Usa prefixo do e-mail como fallback de nome
    email: response.login.email,
    token,
  };
}

//  Realiza cadastro via GraphQL e em seguida faz login para obter o token
export async function realizarCadastro(
  name: string,
  email: string,
  password: string
) {
  const response = await client.request<CadastroResposta>(MUTATION_CADASTRO, {
    name,
    email,
    password,
  });

  // Após cadastro, realiza login para obter o token JWT
  const login = await realizarLogin(email, password);

  return {
    nome: response.signup.name,
    email: login.email,
    token: login.token,
  };
}
