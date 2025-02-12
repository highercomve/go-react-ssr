package storage

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	_ "modernc.org/sqlite"
)

type NoteStorage struct {
	db *sql.DB
}

// Note represents a note record.
type Note struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	Content   string     `json:"content"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

func NewNoteStorage(dataSourceName string) (*NoteStorage, error) {
	db, err := sql.Open("sqlite", dataSourceName)
	if err != nil {
		return nil, err
	}
	return &NoteStorage{db: db}, nil
}

func (ns *NoteStorage) CreateNoteTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS notes (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at DATETIME NOT NULL,
		updated_at DATETIME NOT NULL,
		deleted_at DATETIME
	);`
	tx, err := ns.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec(query)
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (ns *NoteStorage) Add(title, content string) (Note, error) {
	id := uuid.New().String()
	now := time.Now()
	query := `INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
	tx, err := ns.db.Begin()
	if err != nil {
		return Note{}, err
	}
	_, err = tx.Exec(query, id, title, content, now, now)
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}
	err = tx.Commit()
	if err != nil {
		return Note{}, err
	}
	return Note{
		ID:        id,
		Title:     title,
		Content:   content,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (ns *NoteStorage) GetByID(id string) (Note, error) {
	query := `SELECT title, content, created_at, updated_at, deleted_at FROM notes WHERE id = ?`
	tx, err := ns.db.Begin()
	if err != nil {
		return Note{}, err
	}
	row := tx.QueryRow(query, id)
	var note Note
	var deletedAt sql.NullTime
	err = row.Scan(&note.Title, &note.Content, &note.CreatedAt, &note.UpdatedAt, &deletedAt)
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}
	if deletedAt.Valid {
		note.DeletedAt = &deletedAt.Time
	}
	err = tx.Commit()
	if err != nil {
		return Note{}, err
	}
	note.ID = id
	return note, nil
}

func (ns *NoteStorage) UpdateByID(id, title, content string) (Note, error) {
	now := time.Now()
	query := `UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL`
	tx, err := ns.db.Begin()
	if err != nil {
		return Note{}, err
	}
	result, err := tx.Exec(query, title, content, now, id)
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}

	if rowsAffected == 0 {
		tx.Rollback()
		return Note{}, sql.ErrNoRows
	}

	err = tx.Commit()
	if err != nil {
		return Note{}, err
	}

	// Fetch the updated note to return
	return ns.GetByID(id)
}

func (ns *NoteStorage) DeleteByID(id string) (Note, error) {
	// First get the note to return it after deletion
	note, err := ns.GetByID(id)
	if err != nil {
		return Note{}, err
	}

	now := time.Now()
	query := `UPDATE notes SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL`
	tx, err := ns.db.Begin()
	if err != nil {
		return Note{}, err
	}
	result, err := tx.Exec(query, now, id)
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		tx.Rollback()
		return Note{}, err
	}

	if rowsAffected == 0 {
		tx.Rollback()
		return Note{}, sql.ErrNoRows
	}

	err = tx.Commit()
	if err != nil {
		return Note{}, err
	}

	note.DeletedAt = &now
	return note, nil
}

// GetAll retrieves all notes from the database.
func (ns *NoteStorage) GetAll(offset, limit int) ([]Note, error) {
	const query = `
		SELECT id, title, content, created_at, updated_at, deleted_at 
		FROM notes 
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?`
	rows, err := ns.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Note
	for rows.Next() {
		var note Note
		var deletedAt sql.NullTime
		if err := rows.Scan(
			&note.ID,
			&note.Title,
			&note.Content,
			&note.CreatedAt,
			&note.UpdatedAt,
			&deletedAt,
		); err != nil {
			return nil, err
		}
		if deletedAt.Valid {
			note.DeletedAt = &deletedAt.Time
		}
		notes = append(notes, note)
	}
	return notes, nil
}
