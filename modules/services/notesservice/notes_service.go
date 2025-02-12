package notesservice

import (
	"net/http"
	"strconv"

	"github.com/highercomve/go-react-ssr/modules/storage"
	"github.com/labstack/echo/v4"
)

// Global NoteStorage instance which should be initialized during startup.
var noteStorage *storage.NoteStorage

// SetNoteStorage sets the storage instance used by the notes service.
func SetNoteStorage(ns *storage.NoteStorage) {
	noteStorage = ns
}

// Note represents a note structure.
// If you prefer, you can define this type in your storage package and have GetAll() return []storage.Note.
type Note struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// GetAllNotes retrieves all notes with optional pagination support. It is similar to the Pokemon get-all endpoint.
// NOTE: This function assumes that you have implemented a GetAll() method in NoteStorage that returns []Note.
// If not, you might add that method in the storage package.
func GetAllNotes(c echo.Context) (interface{}, error) {
	limitQuery := c.QueryParam("limit")
	offsetQuery := c.QueryParam("offset")

	limit := 1000
	offset := 0

	if limitQuery != "" {
		if parsedLimit, err := strconv.Atoi(limitQuery); err == nil {
			limit = parsedLimit
		}
	}

	if offsetQuery != "" {
		if parsedOffset, err := strconv.Atoi(offsetQuery); err == nil {
			offset = parsedOffset
		}
	}

	// Here we assume that noteStorage.GetAll() exists and returns a slice of Note.
	notes, err := noteStorage.GetAll(offset, limit)
	if err != nil {
		return map[string]string{"error": "Failed to fetch notes"}, err
	}

	return notes, nil
}

// CreateNoteRequest represents the expected payload to create a new note.
type CreateNoteRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// CreateNote creates a new note using the provided title and content.
func CreateNote(c echo.Context) (interface{}, error) {
	req := new(CreateNoteRequest)
	if err := c.Bind(req); err != nil {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}
	if req.Title == "" || req.Content == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Both title and content are required")
	}

	note, err := noteStorage.Add(req.Title, req.Content)
	if err != nil {
		return map[string]string{"error": "Failed to create note"}, err
	}

	return note, nil
}

// GetNote retrieves a note by its ID.
func GetNote(c echo.Context) (interface{}, error) {
	id := c.QueryParam("id")
	if id == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Note id is required")
	}

	note, err := noteStorage.GetByID(id)
	if err != nil {
		return nil, echo.NewHTTPError(http.StatusNotFound, "Note not found")
	}

	return note, nil
}

// UpdateNoteRequest represents the expected payload to update an existing note.
type UpdateNoteRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// UpdateNote updates an existing note identified by id with new title and content.
func UpdateNote(c echo.Context) (interface{}, error) {
	id := c.QueryParam("id")
	if id == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Note id is required")
	}

	req := new(UpdateNoteRequest)
	if err := c.Bind(req); err != nil {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}
	if req.Title == "" || req.Content == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Both title and content are required")
	}

	_, err := noteStorage.UpdateByID(id, req.Title, req.Content)
	if err != nil {
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Failed to update note")
	}

	return map[string]string{"status": "success"}, nil
}

// DeleteNote deletes a note identified by its id.
func DeleteNote(c echo.Context) (interface{}, error) {
	id := c.QueryParam("id")
	if id == "" {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "Note id is required")
	}

	_, err := noteStorage.DeleteByID(id)
	if err != nil {
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete note")
	}

	return map[string]string{"status": "deleted"}, nil
}
