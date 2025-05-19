package omdb

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Estrutura com os dados brutos retornados pela OMDb API
type rawMovie struct {
	Title      string `json:"Title"`      // Título do filme
	Plot       string `json:"Plot"`       // Sinopse
	ImdbRating string `json:"imdbRating"` // Nota do IMDb (string)
	Metascore  string `json:"Metascore"`  // Nota da crítica (string)
	Poster     string `json:"Poster"`     // URL do pôster
	Genre      string `json:"Genre"`      // Lista de gêneros em string única
	ImdbID     string `json:"imdbID"`     // ID do IMDb
	Response   string `json:"Response"`   // Se a requisição foi bem-sucedida
	Error      string `json:"Error"`      // Mensagem de erro, se houver
	Released   string `json:"Released"`   // Data de lançamento (string)
}

// Cliente OMDb contendo chave da API e cliente HTTP configurado
type Client struct {
	APIKey     string       // Chave de acesso à API OMDb
	HTTPClient *http.Client // Cliente HTTP reutilizável com timeout
}

// Cria e retorna um novo cliente OMDb com timeout padrão
func NewClient(apiKey string) *Client {
	return &Client{
		APIKey: apiKey,
		HTTPClient: &http.Client{
			Timeout: time.Second * 10, // Timeout de 10 segundos por requisição
		},
	}
}

// Faz uma requisição para buscar um filme pelo ID na OMDb
func (c *Client) FetchMovieByID(id string) (*rawMovie, error) {
	// Monta a URL com a chave e ID do filme
	url := fmt.Sprintf("http://www.omdbapi.com/?apikey=%s&i=%s&plot=full", c.APIKey, id)

	// Executa requisição GET
	resp, err := c.HTTPClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("erro na requisição: %v", err)
	}
	defer resp.Body.Close() // Garante que o corpo será fechado

	// Verifica se o status HTTP foi OK (200)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status code: %d", resp.StatusCode)
	}

	var data rawMovie
	// Decodifica o corpo JSON da resposta para a struct `rawMovie`
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("erro ao decodificar JSON: %v", err)
	}

	// Verifica se a resposta da OMDb foi "True"
	if data.Response != "True" {
		return nil, fmt.Errorf("OMDb erro: %s", data.Error)
	}

	// Retorna o filme bruto (rawMovie)
	return &data, nil
}
