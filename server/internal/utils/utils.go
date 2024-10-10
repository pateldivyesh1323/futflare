package utils

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
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

func GetAuth0ManageMentAPIToken() string {
	url := "https://" + config.AuthDomain + "/oauth/token"

	payload := strings.NewReader("grant_type=client_credentials&client_id=" + config.AuthClientId + "&client_secret=%7B" + config.AuthSecret + "%7D&audience=" + config.AuthAudience + "%2Fapi%2Fv2%2F")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

	defer res.Body.Close()
	return string(body)
}
