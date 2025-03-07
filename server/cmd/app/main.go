package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/pateldivyesh1323/futflare/server/internal/awslib"
	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"github.com/pateldivyesh1323/futflare/server/internal/router"
	"github.com/pateldivyesh1323/futflare/server/internal/scheduler"
	"github.com/rs/cors"
)

var capsuleCollection = database.Database.Collection("capsule")

func main() {
	fmt.Println("Server fired on http://localhost:8000...")

	// Initialize AWS services

	awslib.Initialize(context.Background())

	// Capsule opener
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := scheduler.CreateIndexes(ctx, capsuleCollection)
	if err != nil {
		log.Fatalf("Failed to create indexes: %v", err)
	}

	go scheduler.UpdateCapsuleOpenStatus(ctx, capsuleCollection)

	// Router
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	r := router.NewRouter()
	handler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8000", handler))
}
