package utils

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

func GetIDFromToken(token string) (string, error) {
	segments := strings.Split(token, ".")
	payload := segments[1]
	decodedPayload, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return "", errors.New("ERROR DECODING PAYLOAD")
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(decodedPayload, &claims); err != nil {
		return "", errors.New("ERROR UNMARSHALLING PAYLOAD")
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("SUB CLAIM NOT FOUND OR NOT A STRING")
	}

	subParts := strings.Split(sub, "|")

	if len(subParts) < 2 {
		return "", errors.New("SUB CLAIM DOES NOT HAVE ID")
	}
	id := subParts[1]

	return id, nil
}

type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func SendJSONResponse(w http.ResponseWriter, status int, message string, data interface{}) {
	response := Response{
		Message: message,
		Data:    data,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
