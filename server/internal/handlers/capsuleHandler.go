package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"github.com/pateldivyesh1323/futflare/server/internal/model"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateCapsule(w http.ResponseWriter, r *http.Request) {
	var c model.Capsule

	err := json.NewDecoder(r.Body).Decode(&c)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	fmt.Println(c.Title)
	if c.Title == "" || c.Message == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Please fill all required fields"))
	}
	collection := database.Database.Collection("capsule")
	res, err := collection.InsertOne(context.Background(),
		bson.M{"title": c.Title,
			"message": c.Message,
			"status":  "locked",
		})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
	}
	w.Write([]byte("Successfully created capsule"))
	fmt.Println(res)
}
