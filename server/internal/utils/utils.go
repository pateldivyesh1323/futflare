package utils

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
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
		fmt.Println()
		return "", errors.New("SUB CLAIM NOT FOUND OR NOT A STRING")
	}

	subParts := strings.Split(sub, "|")

	if len(subParts) < 2 {
		fmt.Println()
		return "", errors.New("SUB CLAIM DOES NOT HAVE ID")
	}
	id := subParts[1]

	return id, nil
}
