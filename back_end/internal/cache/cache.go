package cache

import (
	"movies-api/internal/model"
	"sync"
	"time"
)

// Estrutura para armazenar o filme e o tempo de expiração
type cacheItem struct {
	Movie     *model.Movie
	ExpiresAt time.Time
}

// Cache com controle de concorrência e TTL
type Cache struct {
	mu    sync.RWMutex
	items map[string]cacheItem
	ttl   time.Duration
}

// Cria uma nova instância de cache com TTL definido
func NewCache(ttl time.Duration) *Cache {
	return &Cache{
		items: make(map[string]cacheItem),
		ttl:   ttl,
	}
}

// Tenta recuperar um filme do cache
func (c *Cache) Get(id string) (*model.Movie, bool) {
	c.mu.RLock() // Lock para leitura
	defer c.mu.RUnlock()

	item, found := c.items[id] // Busca item pelo ID
	if !found || time.Now().After(item.ExpiresAt) {
		// Se não encontrado ou expirado, retorna false
		return nil, false
	}
	return item.Movie, true // Retorna filme e sucesso = true
}

// Armazena um filme no cache com expiração baseada no TTL
func (c *Cache) Set(id string, movie *model.Movie) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Define o novo item com expiração futura
	c.items[id] = cacheItem{
		Movie:     movie,
		ExpiresAt: time.Now().Add(c.ttl), // Expira após o TTL definido
	}
}
