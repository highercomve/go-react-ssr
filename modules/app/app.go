package app

import (
	"net/http"

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

	return app
}

func AboutPage(c echo.Context) error {
	data := map[string]interface{}{}
	return c.Render(http.StatusOK, "about.html:About.js", data)
}

func IndexPage(c echo.Context) error {
	data := map[string]interface{}{
		"message":      "Welcome from the server",
		"initialCount": 10,
	}
	return c.Render(http.StatusOK, "index.html:Home.js", data)
}
