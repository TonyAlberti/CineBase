package graphql

import (
	"context"
	"math/rand"
	"movies-api/internal/auth"
	"movies-api/internal/cache"
	"movies-api/internal/model"
	"movies-api/internal/omdb"
	"sort"
	"strings"
	"time"
)

// Estrutura que contém as dependências usadas pelo GraphQL
type Resolver struct {
	Cache *cache.Cache // Cache para armazenar filmes e evitar requisições repetidas
	OMDb  *omdb.Client // Cliente para consumir a OMDb API
	Store *auth.Store  // Armazena usuários e senhas (signup/login)
}

// Construtor que injeta as dependências no resolver
func NewResolver(c *cache.Cache, o *omdb.Client, s *auth.Store) *Resolver {
	return &Resolver{
		Cache: c,
		OMDb:  o,
		Store: s,
	}
}

// Busca um único filme pelo ID (cache → OMDb → adapta e salva)
func (r *Resolver) GetMovieByID(ctx context.Context, id string) (*model.Movie, error) {
	if movie, found := r.Cache.Get(id); found {
		return movie, nil // Retorna do cache, se disponível
	}
	raw, err := r.OMDb.FetchMovieByID(id) // Busca na OMDb
	if err != nil {
		return nil, err
	}
	movie := omdb.AdaptMovie(raw) // Adapta para o modelo interno
	r.Cache.Set(id, movie)        // Armazena no cache
	return movie, nil
}

// Retorna todos os filmes ordenados da data mais recente para mais antiga
func (r *Resolver) GetRecentMovies(ctx context.Context) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var allMovies []*model.Movie

	for _, id := range ids {
		movie, found := r.Cache.Get(id) // Tenta usar o cache
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id) // Busca da OMDb
			if err != nil {
				continue // Pula filmes com erro
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}
		allMovies = append(allMovies, movie)
	}

	// Cria estrutura auxiliar com campo para ordenação por data
	type sortableMovie struct {
		Movie   *model.Movie
		SortKey time.Time
	}

	var sortable []sortableMovie
	for _, m := range allMovies {
		t, err := time.Parse("02 Jan 2006", m.Released) // Converte string para time.Time
		if err == nil {
			sortable = append(sortable, sortableMovie{Movie: m, SortKey: t})
		}
	}

	// Ordena do mais recente para o mais antigo
	sort.Slice(sortable, func(i, j int) bool {
		return sortable[i].SortKey.After(sortable[j].SortKey)
	})

	var result []*model.Movie
	for _, s := range sortable {
		result = append(result, s.Movie)
	}
	return result, nil
}

// Retorna os 10 filmes com maior nota da crítica
func (r *Resolver) GetTopRatedByCritic(ctx context.Context) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var movies []*model.Movie

	for _, id := range ids {
		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}
		movies = append(movies, movie)
	}

	// Ordena por nota da crítica (maior primeiro)
	sort.Slice(movies, func(i, j int) bool {
		return movies[i].CriticRating > movies[j].CriticRating
	})

	if len(movies) > 10 {
		return movies[:10], nil
	}
	return movies, nil
}

// Retorna os 10 filmes com maior nota dos usuários
func (r *Resolver) GetTopRatedByUsers(ctx context.Context) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var movies []*model.Movie

	for _, id := range ids {
		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}
		movies = append(movies, movie)
	}

	// Ordena por nota dos usuários (maior primeiro)
	sort.Slice(movies, func(i, j int) bool {
		return movies[i].UserRating > movies[j].UserRating
	})

	if len(movies) > 10 {
		return movies[:10], nil
	}
	return movies, nil
}

// Retorna filmes com nota alta tanto da crítica quanto dos usuários
func (r *Resolver) GetLovedByAll(ctx context.Context) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var movies []*model.Movie

	for _, id := range ids {
		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}

		// Verifica se atende os critérios de "amado por todos"
		if movie.CriticRating >= 80 && movie.UserRating >= 8.0 {
			movies = append(movies, movie)
		}
	}

	// Ordena por média ponderada entre crítica e usuários
	sort.Slice(movies, func(i, j int) bool {
		mi := float64(movies[i].CriticRating)/10 + movies[i].UserRating
		mj := float64(movies[j].CriticRating)/10 + movies[j].UserRating
		return mi > mj
	})

	return movies, nil
}

// Retorna todos os filmes que pertencem a um gênero específico
func (r *Resolver) GetByGenre(ctx context.Context, genre string) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var movies []*model.Movie

	genre = strings.ToLower(genre) // Normaliza para comparação

	for _, id := range ids {
		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}

		for _, g := range movie.Genres {
			if strings.ToLower(g) == genre {
				movies = append(movies, movie)
				break
			}
		}
	}

	return movies, nil
}

// Retorna um filme aleatório com base nos gêneros informados
func (r *Resolver) GetRandomFromGenres(ctx context.Context, generos []string) (*model.Movie, error) {
	if len(generos) == 0 {
		return nil, nil
	}

	ids := getStaticMovieIDs()
	var candidatos []*model.Movie

	// Normaliza os gêneros informados
	normalized := make([]string, len(generos))
	for i, g := range generos {
		normalized[i] = strings.ToLower(g)
	}

	for _, id := range ids {
		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}

		// Verifica se o filme possui ao menos um dos gêneros buscados
		for _, mg := range movie.Genres {
			for _, g := range normalized {
				if strings.ToLower(mg) == g {
					candidatos = append(candidatos, movie)
					break
				}
			}
		}
	}

	if len(candidatos) == 0 {
		return nil, nil
	}

	// Sorteia um índice aleatório dentro dos candidatos
	rand.Seed(time.Now().UnixNano())
	return candidatos[rand.Intn(len(candidatos))], nil
}

// Retorna todos os filmes disponíveis, sem filtro nem ordenação
func (r *Resolver) GetAllMovies(ctx context.Context) ([]*model.Movie, error) {
	ids := getStaticMovieIDs()
	var allMovies []*model.Movie
	seen := make(map[string]bool) // Evita duplicidade

	for _, id := range ids {
		if seen[id] {
			continue
		}
		seen[id] = true

		movie, found := r.Cache.Get(id)
		if !found {
			raw, err := r.OMDb.FetchMovieByID(id)
			if err != nil {
				continue
			}
			movie = omdb.AdaptMovie(raw)
			r.Cache.Set(id, movie)
		}
		allMovies = append(allMovies, movie)
	}

	return allMovies, nil
}

// IDs estáticos de filmes utilizados como mock/base de dados
func getStaticMovieIDs() []string {
	return []string{
		"tt1375666", "tt0110912", "tt0133093", "tt0361748", "tt0110413",
		"tt0103064", "tt0082971", "tt0095016", "tt1745960", "tt1877830",
		"tt2584384", "tt0109830", "tt0114709", "tt0088763", "tt0110357",
		"tt0120737", "tt0111161", "tt0118799", "tt0372784", "tt1517268",
		"tt0068646", "tt0120815", "tt1285016", "tt0454921", "tt2582802",
		"tt0268978", "tt0317248", "tt5052448", "tt7784604", "tt1457767",
		"tt1179904", "tt1396484", "tt6644200", "tt0070047", "tt1591095",
		"tt2267998", "tt0167404", "tt0816692", "tt1136608", "tt0499549",
		"tt2543164", "tt0470752", "tt1856101", "tt3659388", "tt11858890",
	}
}
