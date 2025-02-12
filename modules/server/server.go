package server

import (
	"net/http"
	"os"

	"github.com/highercomve/go-react-ssr/modules/app"
	"github.com/highercomve/go-react-ssr/modules/app/notes"
	"github.com/highercomve/go-react-ssr/modules/lib/rsccontext"
	"github.com/highercomve/go-react-ssr/modules/lib/template"
	"github.com/highercomve/go-react-ssr/modules/services/notesservice"
	"github.com/highercomve/go-react-ssr/modules/services/pokemonservice"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Start(serverAddress string) {
	e := echo.New()

	renderer := template.CreateTemplateRenderer()
	e.Renderer = renderer
	e.Use(rsccontext.RSCContextMiddleware(renderer))

	e.Static("/assets", "build")

	corsConfig := middleware.CORSConfig{
		Skipper:      middleware.DefaultSkipper,
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{
			"Accept",
			"Content-Type",
			"Content-Length",
			"X-Custom-Header",
			"Origin",
			"Authorization",
			"X-Trace-ID",
			"Trace-Id",
			"x-request-id",
			"X-Request-ID",
			"TraceID",
			"ParentID",
			"Uber-Trace-ID",
			"uber-trace-id",
			"traceparent",
			"tracestate",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodHead,
			http.MethodPut,
			http.MethodPatch,
			http.MethodPost,
			http.MethodDelete,
			http.MethodOptions,
		},
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Secure())
	e.Use(middleware.RequestID())
	e.Use(middleware.CORSWithConfig(corsConfig))

	debug := os.Getenv("DEBUG")
	if debug == "true" {
		e.Debug = true
	}

	notes.LoadApp(e)
	app.LoadApp(e)

	e.GET("/rsc", RSC)

	e.Logger.Fatal(e.Start(serverAddress))
}

var handlers = map[string]func(echo.Context) (interface{}, error){
	"Pokemon/Detail": pokemonservice.GetPokemon,
	"Pokemon/List":   pokemonservice.GetAllPokemon,
	"Notes/List":     notesservice.GetAllNotes,
	"Notes/Detail":   notesservice.GetNote,
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

	jsx, err := renderer.RenderRSC(component+".js", data)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to render RSC"})
	}

	return c.Blob(http.StatusOK, "application/json", jsx)
}
