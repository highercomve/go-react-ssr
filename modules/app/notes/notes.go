package notes

import (
	"net/http"

	"github.com/highercomve/go-react-ssr/modules/services/notesservice"
	"github.com/highercomve/go-react-ssr/modules/storage"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// LoadApp load application
func LoadApp(e *echo.Echo) *echo.Group {
	app := e.Group("")
	app.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))

	// HTML routes
	app.GET("/", NotesPage)
	app.GET("/notes/:id", NoteDetailPage)

	// API routes
	api := app.Group("/api/notes")
	api.GET("", GetAllNotes)
	api.GET("/:id", GetNote)
	api.POST("", CreateNote)
	api.PUT("/:id", UpdateNote)
	api.DELETE("/:id", DeleteNote)

	return app
}

// HTML handlers
func NotesPage(c echo.Context) error {
	notes, err := notesservice.GetAllNotes(c)
	if err != nil {
		return err
	}

	if notes == nil {
		notes = []storage.Note{}
	}

	data := map[string]interface{}{
		"notes": notes,
	}
	return c.Render(http.StatusOK, "notes.html:Notes/App.js", data)
}

func NoteDetailPage(c echo.Context) error {
	id := c.Param("id")
	c.QueryParams().Add("id", id)

	data, err := notesservice.GetNote(c)
	if err != nil {
		return err
	}
	return c.Render(http.StatusOK, "note_detail.html:Notes/Detail.js", data)
}

// API handlers
func GetAllNotes(c echo.Context) error {
	data, err := notesservice.GetAllNotes(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}

func GetNote(c echo.Context) error {
	id := c.Param("id")
	c.QueryParams().Add("id", id)

	data, err := notesservice.GetNote(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}

func CreateNote(c echo.Context) error {
	data, err := notesservice.CreateNote(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, data)
}

func UpdateNote(c echo.Context) error {
	id := c.Param("id")
	c.QueryParams().Add("id", id)

	data, err := notesservice.UpdateNote(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}

func DeleteNote(c echo.Context) error {
	id := c.Param("id")
	c.QueryParams().Add("id", id)

	data, err := notesservice.DeleteNote(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}
