package utils

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
)

func GetIDFromToken(token string) (string, string, error) {
	segments := strings.Split(token, ".")
	payload := segments[1]
	decodedPayload, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return "", "", errors.New("ERROR DECODING PAYLOAD")
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(decodedPayload, &claims); err != nil {
		return "", "", errors.New("ERROR UNMARSHALLING PAYLOAD")
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		return "", "", errors.New("SUB CLAIM NOT FOUND OR NOT A STRING")
	}

	subParts := strings.Split(sub, "|")

	if len(subParts) < 2 {
		return "", "", errors.New("SUB CLAIM DOES NOT HAVE ID")
	}
	id := subParts[1]

	return id, sub, nil
}

type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func SendJSONResponse(w http.ResponseWriter, status int, message string, data any) {
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

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

func GetAuth0ManageMentAPIToken() string {
	url := "https://" + config.AuthDomain + "/oauth/token"

	payload := strings.NewReader("grant_type=client_credentials" +
		"&client_id=" + config.AuthClientId +
		"&client_secret=" + config.AuthSecret +
		"&audience=https://" + config.AuthDomain + "/api/v2/")

	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		fmt.Println("Failed to create request:", err)
		return ""
	}

	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("Failed to send request:", err)
		return ""
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return ""
	}

	var tokenResponse TokenResponse
	if err := json.Unmarshal(body, &tokenResponse); err != nil {
		fmt.Println("Failed to unmarshal response:", err)
		return ""
	}

	if tokenResponse.AccessToken == "" {
		fmt.Println("Warning: Received empty access token from Auth0")
	}

	return tokenResponse.AccessToken
}

func IsEmailValid(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}
