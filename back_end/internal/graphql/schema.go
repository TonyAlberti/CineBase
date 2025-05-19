package graphql

import (
	"errors"
	"movies-api/internal/auth"

	"github.com/graphql-go/graphql"
)

// Cria o schema GraphQL com tipos, queries e mutations
func NewSchema(resolver *Resolver) (graphql.Schema, error) {
	// Define o tipo Movie (usado nas queries)
	movieType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Movie",
		Fields: graphql.Fields{
			"id":            &graphql.Field{Type: graphql.String},
			"title":         &graphql.Field{Type: graphql.String},
			"synopsis":      &graphql.Field{Type: graphql.String},
			"user_rating":   &graphql.Field{Type: graphql.Float},
			"critic_rating": &graphql.Field{Type: graphql.Int},
			"poster_url":    &graphql.Field{Type: graphql.String},
			"genres":        &graphql.Field{Type: graphql.NewList(graphql.String)},
			"released":      &graphql.Field{Type: graphql.String},
		},
	})

	// Define o tipo User (retornado no signup)
	userType := graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id":    &graphql.Field{Type: graphql.String},
			"name":  &graphql.Field{Type: graphql.String},
			"email": &graphql.Field{Type: graphql.String},
		},
	})

	// Tipo retornado pela mutation login (email + token)
	loginResponseType := graphql.NewObject(graphql.ObjectConfig{
		Name: "LoginResponse",
		Fields: graphql.Fields{
			"email": &graphql.Field{Type: graphql.String},
			"token": &graphql.Field{Type: graphql.String},
		},
	})

	// Define todas as queries públicas disponíveis
	queryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"movie": &graphql.Field{
				Type: movieType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)}, // ID obrigatório
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					id := p.Args["id"].(string)
					return resolver.GetMovieByID(p.Context, id)
				},
			},
			"recentMovies": &graphql.Field{
				Type: graphql.NewList(movieType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return resolver.GetRecentMovies(p.Context)
				},
			},
			"bestOfCritics": &graphql.Field{
				Type: graphql.NewList(movieType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return resolver.GetTopRatedByCritic(p.Context)
				},
			},
			"bestOfUsers": &graphql.Field{
				Type: graphql.NewList(movieType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return resolver.GetTopRatedByUsers(p.Context)
				},
			},
			"lovedByAll": &graphql.Field{
				Type: graphql.NewList(movieType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return resolver.GetLovedByAll(p.Context)
				},
			},
			"byGenre": &graphql.Field{
				Type: graphql.NewList(movieType),
				Args: graphql.FieldConfigArgument{
					"genre": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)}, // Gênero obrigatório
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					genre := p.Args["genre"].(string)
					return resolver.GetByGenre(p.Context, genre)
				},
			},
			"randomFromGenres": &graphql.Field{
				Type: movieType,
				Args: graphql.FieldConfigArgument{
					"generos": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.NewList(graphql.String))}, // Lista de gêneros
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					generos := p.Args["generos"].([]interface{})
					var generosStr []string
					for _, g := range generos {
						generosStr = append(generosStr, g.(string)) // Converte para []string
					}
					return resolver.GetRandomFromGenres(p.Context, generosStr)
				},
			},
			// ✅ Nova query para retornar todos os filmes (sem filtro)
			"allMovies": &graphql.Field{
				Type: graphql.NewList(movieType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return resolver.GetAllMovies(p.Context)
				},
			},
		},
	})

	// Define as mutations (signup e login)
	mutationType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"signup": &graphql.Field{
				Type: userType,
				Args: graphql.FieldConfigArgument{
					"name":     &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
					"email":    &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
					"password": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					name := p.Args["name"].(string)
					email := p.Args["email"].(string)
					password := p.Args["password"].(string)

					// Cadastra novo usuário
					return resolver.Store.Signup(name, email, password)
				},
			},
			"login": &graphql.Field{
				Type: loginResponseType,
				Args: graphql.FieldConfigArgument{
					"email":    &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
					"password": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					email := p.Args["email"].(string)
					password := p.Args["password"].(string)

					// Valida credenciais
					if !resolver.Store.Authenticate(email, password) {
						return nil, errors.New("credenciais inválidas")
					}

					// Gera token JWT
					token, err := auth.GenerateToken(email)
					if err != nil {
						return nil, err
					}

					// Retorna o token e email
					return map[string]interface{}{
						"email": email,
						"token": token,
					}, nil
				},
			},
		},
	})

	// Cria o schema GraphQL completo (query + mutation)
	return graphql.NewSchema(graphql.SchemaConfig{
		Query:    queryType,
		Mutation: mutationType,
	})
}
