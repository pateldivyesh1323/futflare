package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/pateldivyesh1323/futflare/server/internal/router"
	"github.com/rs/cors"
)

func main() {
	fmt.Println("Server fired on http://localhost:8000...")
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
