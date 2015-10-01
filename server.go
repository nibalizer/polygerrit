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

	http.Handle("/bower_components/",
		http.StripPrefix("/bower_components/", http.FileServer(http.Dir("bower_components"))))
	http.Handle("/dist/",
		http.StripPrefix("/dist/", http.FileServer(http.Dir("dist"))))
	http.Handle("/", http.FileServer(http.Dir("app")))

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
