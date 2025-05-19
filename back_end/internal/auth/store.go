package auth

import (
	"errors"
	"sync"

	"movies-api/internal/model"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Store com mutex para garantir acesso seguro em concorrência
type Store struct {
	mu    sync.RWMutex
	users map[string]*model.User
}

// Cria e retorna uma nova instância de Store
func NewStore() *Store {
	return &Store{
		users: make(map[string]*model.User), // Inicializa o mapa de usuários
	}
}

// Cadastra um novo usuário senha criptografada
func (s *Store) Signup(name, email, password string) (*model.User, error) {
	s.mu.Lock()         // Trava para escrita
	defer s.mu.Unlock() // Libera o lock no fim da função

	// Verifica se o email já está cadastrado
	if _, exists := s.users[email]; exists {
		return nil, errors.New("email já cadastrado")
	}

	// Criptografa a senha usando bcrypt
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Cria novo usuário com ID único
	user := &model.User{
		ID:       uuid.New().String(),
		Name:     name,
		Email:    email,
		Password: string(hashed), // Salva senha criptografada
	}

	s.users[email] = user
	return user, nil
}

// Realiza login verificando email e senha
func (s *Store) Login(email, password string) (*model.User, error) {
	s.mu.RLock() // Lock para leitura
	user, exists := s.users[email]
	s.mu.RUnlock() // Desbloqueia leitura

	if !exists {
		return nil, errors.New("usuário não encontrado")
	}

	// Compara senha informada com a hash armazenada
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("senha incorreta")
	}

	return user, nil
}

// Método auxiliar que apenas valida email e senha (sem retornar usuário)
func (s *Store) Authenticate(email, password string) bool {
	s.mu.RLock()
	user, exists := s.users[email]
	s.mu.RUnlock()

	if !exists {
		return false
	}

	// Retorna true se a senha for válida
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}
