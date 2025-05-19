package model

type Movie struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Synopsis     string   `json:"synopsis"`
	UserRating   float64  `json:"user_rating"`
	CriticRating int      `json:"critic_rating"`
	PosterURL    string   `json:"poster_url"`
	Genres       []string `json:"genres"`
	Released     string   `json:"released"`
}
