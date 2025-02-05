package server

import (
	"net/http"
	"os"

	"github.com/highercomve/go-react-ssr/modules/app"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Start(serverAddress string) {
	e := echo.New()

	e.Static("/assets", "build")
	e.Renderer = CreateTemplateRenderer()

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

	app.LoadApp(e)

	e.GET("/", app.IndexPage)

	e.Logger.Fatal(e.Start(serverAddress))
}
