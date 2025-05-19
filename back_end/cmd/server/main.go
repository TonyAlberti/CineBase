package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	gql "github.com/graphql-go/graphql"
	"github.com/joho/godotenv"

	"movies-api/internal/auth"
	"movies-api/internal/cache"
	"movies-api/internal/graphql"
	"movies-api/internal/omdb"
)

func main() {
	// Carrega as variáveis de ambiente do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Erro ao carregar o arquivo .env")
	}

	// Busca a chave da OMDb API
	apiKey := os.Getenv("OMDB_API_KEY")
	if apiKey == "" {
		log.Fatal("OMDB_API_KEY não definida no ambiente")
	}

	// Inicializa o cache com validade de 6 horas
	cache := cache.NewCache(6 * time.Hour)

	// Cria um cliente para consumir a OMDb API
	omdbClient := omdb.NewClient(apiKey)

	// Cria o store de autenticação (ex: usuários logados, tokens, etc)
	authStore := auth.NewStore()

	// Cria o resolver GraphQL com as dependências injetadas
	resolver := graphql.NewResolver(cache, omdbClient, authStore)

	// Gera o schema GraphQL com base no resolver
	schema, err := graphql.NewSchema(resolver)
	if err != nil {
		log.Fatalf("Erro ao criar schema: %v", err)
	}

	// Cria uma instância do servidor Fiber
	app := fiber.New()

	// Habilita CORS para permitir requisições externas
	app.Use(cors.New())

	// Define a rota /graphql para receber requisições POST
	app.Post("/graphql", func(c *fiber.Ctx) error {
		// Garante que o Content-Type seja application/json
		if c.Get("Content-Type") != "application/json" {
			return c.Status(415).JSON(fiber.Map{"error": "Unsupported Media Type"})
		}

		// Estrutura para armazenar a requisição GraphQL
		var params struct {
			Query         string                 `json:"query"`
			Variables     map[string]interface{} `json:"variables"`
			OperationName string                 `json:"operationName"`
		}

		// Tenta converter o corpo da requisição JSON para a struct `params`
		if err := json.Unmarshal(c.Body(), &params); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Corpo inválido"})
		}

		// Executa a query GraphQL usando o schema e os parâmetros recebidos
		result := gql.Do(gql.Params{
			Schema:         schema,
			RequestString:  params.Query,
			VariableValues: params.Variables,
			Context:        c.Context(),
		})

		// Se houver erros de execução, retorna 400 com os erros
		if len(result.Errors) > 0 {
			return c.Status(400).JSON(result.Errors)
		}

		// Retorna o resultado da query em JSON
		return c.JSON(result)
	})

	// Informa no log onde o servidor está rodando
	log.Println("Servidor rodando em http://localhost:8080/graphql")

	// Inicia o servidor na porta 8080 (encerra com erro se falhar)
	log.Fatal(app.Listen(":8080"))
}
