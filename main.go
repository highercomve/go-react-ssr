package main

import (
	"log"
	"os"
	"strings"

	"github.com/highercomve/go-react-ssr/modules/lib/env"
	"github.com/highercomve/go-react-ssr/modules/server"
	"github.com/highercomve/go-react-ssr/modules/services/notesservice"
	"github.com/highercomve/go-react-ssr/modules/storage"
)

func init() {
	buildEnvironmentJS("build")
}

func main() {
	// Initialize the database
	noteStorage, err := storage.NewNoteStorage("notes.db")
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create the notes table
	if err := noteStorage.CreateNoteTable(); err != nil {
		log.Fatalf("Failed to create notes table: %v", err)
	}

	// Set the note storage for the notes service
	notesservice.SetNoteStorage(noteStorage)

	// Start the server
	server.Start(env.GetServerAddress())
}

func buildEnvironmentJS(folder string) error {
	var environment = "if (!window.env) { window.env = {} } \n"
	for _, e := range os.Environ() {
		if strings.Contains(e, "REACT_APP_") {
			pair := strings.SplitN(e, "=", 2)
			environment = environment + "window.env." + pair[0] + "='" + pair[1] + "';"
		}
	}

	return os.WriteFile(folder+"/environment.js", []byte(environment), 0644)
}
