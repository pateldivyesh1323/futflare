package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/pateldivyesh1323/futflare/server/internal/router"
)

func main() {
	fmt.Println("Server fired on http://localhost:8000...")
	r := router.NewRouter()
	log.Fatal(http.ListenAndServe(":8000", r))
}
