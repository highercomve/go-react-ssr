package env

import (
	"fmt"
	"os"
)

func GetEnv(key, defaultValue string) string {
	v := os.Getenv(key)

	if v == "" {
		return defaultValue
	}

	return v
}

func GetServerAddress() string {
	serverHost := GetEnv("SERVER_HOST", "0.0.0.0")
	serverPort := GetEnv("SERVER_PORT", "7070")

	return fmt.Sprintf("%s:%s", serverHost, serverPort)
}

func GetServerURL() string {
	serverHost := GetEnv("SERVER_HOST", "0.0.0.0")
	serverPort := GetEnv("SERVER_PORT", "9090")
	serverProtocol := GetEnv("SERVER_PROTOCOL", "http")

	return fmt.Sprintf("%s://%s:%s", serverProtocol, serverHost, serverPort)
}
