package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/pateldivyesh1323/futflare/server/internal/awslib"
	"github.com/pateldivyesh1323/futflare/server/internal/model"
	"github.com/pateldivyesh1323/futflare/server/internal/utils"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
	"github.com/pateldivyesh1323/futflare/server/internal/database"
	"go.mongodb.org/mongo-driver/bson"
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
	_, err := utils.GetIDFromToken(token)
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
		case model.ContentTypeImage:
			if img, ok := item.Content.(model.ImageContent); ok {
				if img.URL == "" {
					utils.SendJSONResponse(w, http.StatusBadRequest, "Image URL cannot be empty", nil)
					return
				}
			} else {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid image content format", nil)
				return
			}
		case model.ContentTypeVideo:
			if vid, ok := item.Content.(model.VideoContent); ok {
				if vid.URL == "" {
					utils.SendJSONResponse(w, http.StatusBadRequest, "Video URL cannot be empty", nil)
					return
				}
			} else {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid video content format", nil)
				return
			}
		case model.ContentTypeMessage:
			if msg, ok := item.Content.(model.MessageContent); ok {
				if msg.Text == "" {
					utils.SendJSONResponse(w, http.StatusBadRequest, "Message text cannot be empty", nil)
					return
				}
			} else {
				utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid message content format", nil)
				return
			}
		default:
			utils.SendJSONResponse(w, http.StatusBadRequest, "Invalid content type", nil)
			return
		}
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
