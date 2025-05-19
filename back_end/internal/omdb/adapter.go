package omdb

import (
	"movies-api/internal/model"
	"strconv"
	"strings"
)

// AdaptMovie converte rawMovie (OMDb) para Movie (nosso modelo)
func AdaptMovie(r *rawMovie) *model.Movie {
	userRating, _ := strconv.ParseFloat(r.ImdbRating, 64)
	criticRating, _ := strconv.Atoi(r.Metascore)
	genres := strings.Split(r.Genre, ", ")

	return &model.Movie{
		ID:           r.ImdbID,
		Title:        r.Title,
		Synopsis:     r.Plot,
		UserRating:   userRating,
		CriticRating: criticRating,
		PosterURL:    r.Poster,
		Genres:       genres,
		Released:     r.Released,
	}
}
