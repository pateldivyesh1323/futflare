package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"github.com/pateldivyesh1323/futflare/server/internal/model"
	"github.com/pateldivyesh1323/futflare/server/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var capsuleCollection = database.Database.Collection("capsule")

type ErrorResponse struct {
	Error string `json:"error"`
}

func CreateCapsule(w http.ResponseWriter, r *http.Request) {
	var c model.Capsule
	err := json.NewDecoder(r.Body).Decode(&c)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if c.Title == "" || c.Description == "" || c.ScheduledOpenDate.IsZero() || len(c.ContentItems) == 0 {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Please fill all required fields and add at least one content item", nil)
		return
	}

	if len(c.ContentItems) > 10 {
		utils.SendJSONResponse(w, http.StatusForbidden, "You can add maximum 10 participants!", nil)
		return
	}

	if c.ScheduledOpenDate.Before(time.Now()) {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Please select future date and time", nil)
		return
	}

	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, err := utils.GetIDFromToken(token)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, err.Error(), nil)
		return
	}

	c.ID = primitive.NewObjectID()
	c.Creator = id
	c.IsOpened = false
	c.CreatedAt = time.Now()
	_, err = capsuleCollection.InsertOne(context.Background(), c)

	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Internal server error", nil)
		return
	}

	utils.SendJSONResponse(w, http.StatusCreated, "Successfully created capsule", c)
}

func GetAllCapsules(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, err := utils.GetIDFromToken(token)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusForbidden, "Unauthorized", nil)
		return
	}

	authManagementToken := utils.GetAuth0ManageMentAPIToken()
	fmt.Println("authManagementToken", authManagementToken)

	cursor, err := capsuleCollection.Find(context.Background(), bson.M{
		"$or": []bson.M{
			{"creator": id},
			{"participant_emails": bson.M{"$elemMatch": bson.M{"$eq": id}}},
		},
	})
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}
	defer cursor.Close(context.Background())

	var capsule []primitive.M

	for cursor.Next(context.Background()) {
		var cap bson.M
		err := cursor.Decode(&cap)
		if err != nil {
			utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
			return
		}
		filteredCap := map[string]interface{}{
			"_id":                 cap["_id"],
			"created_at":          cap["created_at"],
			"creator":             cap["creator"],
			"title":               cap["title"],
			"description":         cap["description"],
			"is_opened":           cap["is_opened"],
			"participant_emails":  cap["participant_emails"],
			"scheduled_open_date": cap["scheduled_open_date"],
		}
		capsule = append(capsule, filteredCap)
	}

	utils.SendJSONResponse(w, http.StatusOK, "Successfully fetched capsules", capsule)
}
