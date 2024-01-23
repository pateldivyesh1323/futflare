package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Capsule struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Creator  string             `bson:"creator,omitempty"`
	Title    string             `bson:"title,omitempty"`
	Message  string             `bson:"message,omitempty"`
	Memories []string           `bson:"memories,omitempty"`
	Status   string             `bson:"status"`
	
}
