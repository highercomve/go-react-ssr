package app

import (
	"net/http"
	"strconv"

	"github.com/highercomve/go-react-ssr/modules/lib/pokemon"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// LoadApp load application
func LoadApp(e *echo.Echo) *echo.Group {
	app := e.Group("")
	app.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))

	app.GET("/about", AboutPage)
	app.GET("/pokemon", GetAllPokemon)
	app.GET("/pokemon/:name", GetPokemon)

	return app
}

func AboutPage(c echo.Context) error {
	data := map[string]interface{}{}
	return c.Render(http.StatusOK, "about.html:About.js", data)
}

func GetAllPokemon(c echo.Context) error {
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
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch pokemons"})
	}

	return c.Render(http.StatusOK, "pokemon_list.html:Pokemon/List.js", response)
}

func GetPokemon(c echo.Context) error {
	client := pokemon.NewApi()
	name := c.Param("name")

	response, err := client.GetByIDOrName(c.Request().Context(), name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch pokemon"})
	}

	if c.Request().Header.Get("Content-Type") == "application/json" {
		return c.JSON(http.StatusOK, response)
	}

	return c.Render(http.StatusOK, "pokemon_detail.html:Pokemon/Detail.js", response)
}
