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
	AWSRegion       string
	AWSAccessKey    string
	AWSSecretKey    string
	AWSS3Bucket     string
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
	AWSRegion = os.Getenv("AWS_S3_REGION")
	AWSAccessKey = os.Getenv("AWS_ACCESS_KEY")
	AWSSecretKey = os.Getenv("AWS_SECRET_KEY")
	AWSS3Bucket = os.Getenv("AWS_S3_BUCKET")
}
