package utilities

import (
	"log"
	"os"
)

func GetEnv(key string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		log.Fatalf("Environment variable \"%s\" is missing", key)
	}

	return value
}
