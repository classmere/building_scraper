package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
    "log"
)


func getJsonString() string {
        resp, err := http.Get("https://api.oregonstate.edu/v1/locations/?apikey=LUdcPj28kBF62YQd5NkjQfrh7evZwLQw&page%5Bsize%5D=10000")
        jsonString := ""

    if err != nil {
        log.Fatalf("%s", err)
    } else {
        defer resp.Body.Close()
        contents, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalf("%s", err)
        }
        jsonString = string(contents)
    }
    return jsonString
}

func main() {
    fmt.Println(getJsonString())
}
