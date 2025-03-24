package handlers

import (
	"context"
	"encoding/json"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/pateldivyesh1323/futflare/server/internal/awslib"
	"github.com/pateldivyesh1323/futflare/server/internal/model"
	"github.com/pateldivyesh1323/futflare/server/internal/utils"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var capsuleCollection = database.Database.Collection("capsule")

const (
	PRESIGNED_URL_EXPIRY = 15 * time.Minute
)

type PresignedURLRequest struct {
	ContentType string `json:"content_type"`
	FileName    string `json:"file_name"`
	FileType    string `json:"file_type"`
}

type PresignedURLResponse struct {
	URL         string `json:"presigned_url"`
	ObjectKey   string `json:"object_key"`
	ContentType string `json:"content_type"`
	FinalURL    string `json:"final_url"`
}

func GeneratePresignedURL(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	_, _, err := utils.GetIDFromToken(token)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	var req PresignedURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if req.ContentType != "image" && req.ContentType != "video" {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Content type must be 'image' or 'video'", nil)
		return
	}

	s3Client, err := awslib.GetS3Client()
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Failed to initialize AWS S3 client", nil)
		return
	}

	objectKey := primitive.NewObjectID().Hex() + "-" + req.FileName

	presignClient := s3.NewPresignClient(s3Client)
	presignReq, err := presignClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      aws.String(config.AWSS3Bucket),
		Key:         aws.String(objectKey),
		ContentType: aws.String(req.FileType),
	}, s3.WithPresignExpires(PRESIGNED_URL_EXPIRY))

	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Failed to generate pre-signed URL", nil)
		return
	}

	objectURL := "https://" + config.AWSS3Bucket + ".s3.amazonaws.com/" + objectKey

	response := PresignedURLResponse{
		URL:         presignReq.URL,
		ObjectKey:   objectKey,
		ContentType: req.ContentType,
		FinalURL:    objectURL,
	}

	utils.SendJSONResponse(w, http.StatusOK, "Pre-signed URL generated successfully", response)
}

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
		utils.SendJSONResponse(w, http.StatusForbidden, "You can add maximum 10 content items!", nil)
		return
	}

	if c.ScheduledOpenDate.Before(time.Now()) {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Please select future date and time", nil)
		return
	}

	for _, item := range c.ContentItems {
		switch item.Type {
		case model.ContentTypeMessage:
			msgContent, ok := item.Content.(model.MessageContent)
			if !ok {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid message content format", nil)
				return
			}

			if msgContent.Text == "" {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Message text cannot be empty", nil)
				return
			}

		case model.ContentTypeImage:
			imgContent, ok := item.Content.(model.ImageContent)
			if !ok {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid image content format", nil)
				return
			}

			if imgContent.URL == "" {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Image URL cannot be empty", nil)
				return
			}

		case model.ContentTypeVideo:
			vidContent, ok := item.Content.(model.VideoContent)
			if !ok {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid video content format", nil)
				return
			}

			if vidContent.URL == "" {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Video URL cannot be empty", nil)
				return
			}

		default:
			utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid content type", nil)
			return
		}
	}

	if len(c.ParticipantEmails) > 10 {
		utils.SendJSONResponse(w, http.StatusForbidden, "You can add maximum 10 participants!", nil)
		return
	}

	for _, email := range c.ParticipantEmails {
		if !utils.IsEmailValid(email) {
			utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid email", nil)
			return
		}
	}

	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, _, err := utils.GetIDFromToken(token)
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

	utils.SendJSONResponse(w, http.StatusCreated, "Successfully created capsule", nil)
}

type PaginationResponse struct {
	Data         []primitive.M `json:"data"`
	TotalCount   int64         `json:"totalCount"`
	CurrentCount int           `json:"currentCount"`
	TotalPages   int           `json:"totalPages"`
	CurrentPage  int           `json:"currentPage"`
}

func GetAllCapsules(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	id, fullId, err := utils.GetIDFromToken(token)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusForbidden, "Unauthorized", nil)
		return
	}

	userDetails, err := getUserById(fullId)

	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	page := 1
	limit := 10

	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		if pageNum, err := strconv.Atoi(pageStr); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if limitStr, err := strconv.Atoi(limitStr); err == nil && limitStr > 0 {
			limit = limitStr
		}
	}

	searchQuery := r.URL.Query().Get("searchQuery")
	sortParam := r.URL.Query().Get("sortBy")
	sortOrder := -1
	if sortParam == "oldest" {
		sortOrder = 1
	}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: sortOrder}}).
		SetSkip(int64((page - 1) * limit)).
		SetLimit(int64(limit))

	filter := bson.M{
		"$or": []bson.M{
			{"creator": id},
			{"participant_emails": bson.M{"$elemMatch": bson.M{"$eq": userDetails.Email}}},
		},
	}

	if searchQuery != "" {
		filter = bson.M{
			"$and": []bson.M{
				filter,
				{
					"$or": []bson.M{
						{"title": bson.M{"$regex": searchQuery, "$options": "i"}},
						{"description": bson.M{"$regex": searchQuery, "$options": "i"}},
					},
				},
			},
		}
	}

	totalCount, err := capsuleCollection.CountDocuments(context.Background(), filter)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	cursor, err := capsuleCollection.Find(context.Background(), filter, opts)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}
	defer cursor.Close(context.Background())

	var capsules []primitive.M

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
		capsules = append(capsules, filteredCap)
	}

	response := PaginationResponse{
		Data:         capsules,
		TotalCount:   totalCount,
		CurrentCount: len(capsules),
		TotalPages:   totalPages,
		CurrentPage:  page,
	}

	utils.SendJSONResponse(w, http.StatusOK, "Successfully fetched capsules", response)
}

func GetCapsule(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	userID, fullId, err := utils.GetIDFromToken(token)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusForbidden, "Unauthorized", nil)
		return
	}

	userDetails, err := getUserById(fullId)

	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid capsule ID", nil)
		return
	}

	var capsule bson.M
	err = capsuleCollection.FindOne(context.Background(), bson.M{
		"_id": objectID,
		"$or": []bson.M{
			{"creator": userID},
			{"participant_emails": bson.M{"$elemMatch": bson.M{"$eq": userDetails.Email}}},
		},
	}).Decode(&capsule)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			utils.SendJSONResponse(w, http.StatusNotFound, "Capsule not found", nil)
		} else {
			utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		}
		return
	}

	isOpened, ok := capsule["is_opened"].(bool)
	if !ok {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	response := map[string]interface{}{
		"_id":                 capsule["_id"],
		"created_at":          capsule["created_at"],
		"creator":             capsule["creator"],
		"title":               capsule["title"],
		"description":         capsule["description"],
		"is_opened":           capsule["is_opened"],
		"participant_emails":  capsule["participant_emails"],
		"scheduled_open_date": capsule["scheduled_open_date"],
	}

	if isOpened {
		response["content_items"] = capsule["content_items"]
	}

	utils.SendJSONResponse(w, http.StatusOK, "Successfully fetched capsule", response)
}

func DeleteCapsule(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer")
	userId, _, _ := utils.GetIDFromToken(token)

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid capsule ID", nil)
		return
	}

	deleteResult, err := capsuleCollection.DeleteOne(context.Background(), bson.M{
		"_id":     objectId,
		"creator": userId,
	})

	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	if deleteResult.DeletedCount == 0 {
		utils.SendJSONResponse(w, http.StatusNotFound, "Capsule not found", nil)
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, "Capsule deleted successfully", nil)
}
