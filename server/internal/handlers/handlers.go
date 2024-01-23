package handlers

import "net/http"

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("<h1>Welcome to Futflare Backend</h1>"))
}
