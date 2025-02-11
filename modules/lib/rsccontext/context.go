package rsccontext

import (
	"github.com/highercomve/go-react-ssr/modules/lib/template"
	"github.com/labstack/echo/v4"
)

// RSCContext extends echo.Context with additional fields
type RSCContext struct {
	echo.Context
	TemplateRenderer *template.TemplateRenderer
}

// RSCContextMiddleware adds custom context to each request
func RSCContextMiddleware(t *template.TemplateRenderer) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &RSCContext{
				Context:          c,
				TemplateRenderer: t,
			}
			return next(cc)
		}
	}
}
