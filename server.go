package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	var port = flag.String("port", ":8081", "Port to serve HTTP requests on")

	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(".")))
	log.Println("Serving on port", *port)
	log.Fatal(http.ListenAndServe(*port, nil))
}
