package scheduler

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func UpdateCapsuleOpenStatus(ctx context.Context, capsuleCollection *mongo.Collection) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			updateCapsules(ctx, capsuleCollection)
		}
	}
}

func updateCapsules(ctx context.Context, capsuleCollection *mongo.Collection) {
	now := time.Now().UTC()

	filter := bson.M{
		"is_opened":           false,
		"scheduled_open_date": bson.M{"$lte": now},
	}

	update := bson.M{
		"$set": bson.M{"is_opened": true},
	}

	result, err := capsuleCollection.UpdateMany(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating capsules: %v", err)
		return
	}

	if result.ModifiedCount > 0 {
		log.Printf("Opened %d capsules", result.ModifiedCount)
	} else {
		log.Println("No capsules were updated")
	}
}

func CreateIndexes(ctx context.Context, capsuleCollection *mongo.Collection) error {
	_, err := capsuleCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{
			{Key: "is_opened", Value: 1},
			{Key: "scheduled_open_date", Value: 1},
		},
	})
	return err
}
