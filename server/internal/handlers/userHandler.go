package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/pateldivyesh1323/futflare/server/internal/config"
	"github.com/pateldivyesh1323/futflare/server/internal/utils"
)

type UserDetails struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

func getUserById(userId string) (UserDetails, error) {
	token := utils.GetAuth0ManageMentAPIToken()

	auth0URL := "https://" + config.AuthDomain + "/api/v2/users/" + url.PathEscape(userId)

	req, err := http.NewRequest("GET", auth0URL, nil)
	if err != nil {
		return UserDetails{}, err
	}

	req.Header.Add("authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return UserDetails{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return UserDetails{}, err
	}

	if resp.StatusCode != http.StatusOK {
		return UserDetails{}, fmt.Errorf("failed to get user: %s", string(body))
	}

	var userDetails UserDetails
	if err := json.Unmarshal(body, &userDetails); err != nil {
		fmt.Println("Failed to unmarshal user details:", err)
		return UserDetails{}, err
	}

	return userDetails, nil
}
