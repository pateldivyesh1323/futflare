package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"github.com/pateldivyesh1323/futflare/server/internal/model"
	"github.com/pateldivyesh1323/futflare/server/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var capsuleCollection = database.Database.Collection("capsule")

func CreateCapsule(w http.ResponseWriter, r *http.Request) {
	var c model.Capsule
	err := json.NewDecoder(r.Body).Decode(&c)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Internal server error"))
	}

	if c.Title == "" || c.Message == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Please fill all required fields"))
	}

	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, err := utils.GetIDFromToken(token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
	}

	_, err = capsuleCollection.InsertOne(context.Background(),
		bson.M{
			"title":   c.Title,
			"message": c.Message,
			"status":  "locked",
			"creator": id,
		})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
	}

	w.Write([]byte("Successfully created capsule"))
}

func GetAllCapsules(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, err := utils.GetIDFromToken(token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	cursor, err := capsuleCollection.Find(context.Background(), bson.M{
		"creator": id,
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
	}
	defer cursor.Close(context.Background())

	var capsule []primitive.M

	for cursor.Next(context.Background()) {
		var cap bson.M
		err := cursor.Decode(&cap)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
		}
		capsule = append(capsule, cap)
	}

	json.NewEncoder(w).Encode(capsule)
}
