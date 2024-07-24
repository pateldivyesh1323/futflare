package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ContentType string

const (
	ContentTypeImage   ContentType = "image"
	ContentTypeVideo   ContentType = "video"
	ContentTypeMessage ContentType = "message"
)

type Capsule struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title             string             `bson:"title,omitempty" json:"title"`
	Description       string             `bson:"description,omitempty" json:"description"`
	Creator           string             `bson:"creator,omitempty" json:"creator,omitempty"`
	IsOpened          bool               `bson:"is_opened" json:"is_opened,omitempty"`
	ParticipantEmails []string           `bson:"participant_emails" json:"participant_emails"`
	ScheduledOpenDate time.Time          `bson:"scheduled_open_date" json:"scheduled_open_date"`
	ContentItems      []ContentItem      `bson:"content_items" json:"content_items"`
	CreatedAt         time.Time          `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ContentItem struct {
	Type ContentType `bson:"type"`
	URL  string      `bson:"url"`
	Text string      `bson:"text"`
}
