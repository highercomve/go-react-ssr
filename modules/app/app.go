package app

import (
	"net/http"

	"github.com/highercomve/go-react-ssr/modules/lib/rsccontext"
	"github.com/highercomve/go-react-ssr/modules/services"
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
	app.GET("/pokemon", GetAllPokemonPage)
	app.GET("/pokemon/:name", GetPokemonPage)
	app.GET("/rsc", RSC)

	return app
}

var handlers = map[string]func(echo.Context) (interface{}, error){
	"PokemonList.js":   services.GetAllPokemon,
	"PokemonDetail.js": services.GetPokemon,
}

func AboutPage(c echo.Context) error {
	data := map[string]interface{}{}
	return c.Render(http.StatusOK, "about.html:About.js", data)
}

func IndexPage(c echo.Context) error {
	data := map[string]interface{}{
		"message":      "Welcome from the server",
		"initialCount": 100,
	}
	return c.Render(http.StatusOK, "index.html:Home.js", data)
}

func GetAllPokemonPage(c echo.Context) error {
	response, err := services.GetAllPokemon(c)
	if err != nil {
		return err
	}

	return c.Render(http.StatusOK, "pokemon_list.html:PokemonList.js", response)
}

func GetPokemonPage(c echo.Context) error {
	c.QueryParams().Set("name", c.Param("name"))

	response, err := services.GetPokemon(c)
	if err != nil {
		return err
	}

	return c.Render(http.StatusOK, "pokemon_detail.html:PokemonDetail.js", response)
}

func RSC(c echo.Context) error {
	component := c.QueryParam("component")
	rscContext := c.(*rsccontext.RSCContext)
	renderer := rscContext.TemplateRenderer

	var data interface{}
	var err error

	// Find and execute handler for path
	if handler, exists := handlers[component]; exists {
		data, err = handler(c)
		if err != nil {
			if he, ok := err.(*echo.HTTPError); ok {
				return c.JSON(he.Code, map[string]string{"error": he.Message.(string)})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch data"})
		}
	}

	jsx, err := renderer.RenderRSC(component, data)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to render RSC"})
	}

	return c.Blob(http.StatusOK, "application/json", jsx)
}
