package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Chave secreta usada para assinar o token (poderia vir de uma variável de ambiente)
var jwtKey = []byte("secreta")

// Gera um token JWT com o email como "subject"
func GenerateToken(email string) (string, error) {
	claims := &jwt.RegisteredClaims{
		Subject:   email,                                              // Define o "sub" (usuário) do token
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Expira em 24h
		IssuedAt:  jwt.NewNumericDate(time.Now()),                     // Marca a data de emissão
	}

	// Cria um token com algoritmo HS256 e os dados (claims) definidos
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Assina o token com a chave secreta e retorna como string
	return token.SignedString(jwtKey)
}
