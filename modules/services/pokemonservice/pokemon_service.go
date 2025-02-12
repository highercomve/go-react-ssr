package pokemonservice

import (
	"net/http"
	"strconv"

	"github.com/highercomve/go-react-ssr/modules/lib/pokemon"
	"github.com/labstack/echo/v4"
)

func GetAllPokemon(c echo.Context) (interface{}, error) {
	client := pokemon.NewApi()
	limitQuery := c.QueryParam("limit")
	offsetQuery := c.QueryParam("offset")

	limit := 1000
	offset := 0

	if limitQuery != "" {
		parsedLimit, err := strconv.Atoi(limitQuery)
		if err == nil {
			limit = parsedLimit
		}
	}

	if offsetQuery != "" {
		parsedOffset, err := strconv.Atoi(offsetQuery)
		if err == nil {
			offset = parsedOffset
		}
	}

	response, err := client.GetAll(c.Request().Context(), limit, offset)
	if err != nil {
		return map[string]string{"error": "Failed to fetch pokemons"}, err
	}

	return response, nil
}

func GetPokemon(c echo.Context) (interface{}, error) {
	client := pokemon.NewApi()
	name := c.QueryParam("name")

	if name == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Pokemon name is required")
	}

	response, err := client.GetByIDOrName(c.Request().Context(), name)
	if err != nil {
		return nil, err
	}

	return response, nil
}
