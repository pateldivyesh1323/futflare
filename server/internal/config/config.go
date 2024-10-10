package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	MongoDBURL      string
	MongoDBDatabase string
	AuthDomain      string
	AuthAudience    string
	AuthSecret      string
	AuthClientId    string
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
	MongoDBURL = os.Getenv("MONGODB_URL")
	MongoDBDatabase = os.Getenv("MONGODB_DATABASE_NAME")
	AuthDomain = os.Getenv("AUTH_DOMAIN")
	AuthAudience = os.Getenv("AUTH_AUDIENCE")
	AuthSecret = os.Getenv("AUTH_SECRET")
	AuthClientId = os.Getenv("AUTH_CLIENTID")
}
