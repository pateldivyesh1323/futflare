package router

import (
	"github.com/gorilla/mux"
	"github.com/pateldivyesh1323/futflare/server/internal/handlers"
	"github.com/pateldivyesh1323/futflare/server/internal/middleware"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.AuthenticationMiddleware())
	r.HandleFunc("/", handlers.HomeHandler).Methods("GET")

	return r
}
