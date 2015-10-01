package main

import (
	"flag"
	"io"
	"log"
	"net/http"
	"net/url"
)

var port = flag.String("port", ":8081", "Port to serve HTTP requests on")

func main() {
	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/changes/", handleChanges)
	log.Println("Serving on port", *port)
	log.Fatal(http.ListenAndServe(*port, nil))
}

func handleChanges(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	u, err := url.Parse("https://gerrit-review.googlesource.com/changes/")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	u.RawQuery = r.URL.RawQuery
	res, err := http.Get(u.String())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer res.Body.Close()
	if _, err := io.Copy(w, res.Body); err != nil {
		log.Println("Error copying response to ResponseWriter:", err)
		return
	}
}
