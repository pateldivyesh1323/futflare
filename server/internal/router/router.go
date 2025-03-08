package router

import (
	"github.com/gorilla/mux"
	"github.com/pateldivyesh1323/futflare/server/internal/handlers"
	"github.com/pateldivyesh1323/futflare/server/internal/middleware"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.AuthenticationMiddleware())
	r.HandleFunc("/api", handlers.HomeHandler).Methods("GET")
	r.HandleFunc("/api/capsule", handlers.CreateCapsule).Methods("POST")
	r.HandleFunc("/api/capsule", handlers.GetAllCapsules).Methods("GET")
	r.HandleFunc("/api/uploader/presigned-url", handlers.GeneratePresignedURL).Methods("POST")

	return r
}
