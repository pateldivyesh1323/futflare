package database

import (
	"context"
	"fmt"
	"log"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Database *mongo.Database

func init() {
	clientOptions := options.Client().ApplyURI(config.MongoDBURL)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	Database = client.Database(config.MongoDBDatabase)
	fmt.Println("Connected to MongoDB")
}
