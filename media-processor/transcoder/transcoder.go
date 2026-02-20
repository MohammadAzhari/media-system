package transcoder

import (
	"log"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
)

var scalesMap = map[string]string{
	"480p":  "scale=854:480",
	"720p":  "scale=1280:720",
	"1080p": "scale=1920:1080",
}
var scales = make([]string, 0, len(scalesMap))

func init() {
	for scale := range scalesMap {
		scales = append(scales, scale)
	}
}

func transcodeVideo(inputUrl, scale string, ch chan string) {
	outputFileName := extractFileName(inputUrl) + "_" + scale + ".mp4"
	cmd := exec.Command("ffmpeg", "-i", inputUrl,
		"-vf", scalesMap[scale], "-c:v", "libx264", "-crf", "23",
		"-c:a", "copy", outputFileName)

	cmd.Run()

	if _, err := os.Stat("uploads/" + outputFileName); err != nil {
		log.Printf("Error transcoding video: %v, scale: %v", err, scale)
		ch <- scale
	}
}

func Transcode(inputUrl string) []string {
	var wg sync.WaitGroup
	errChan := make(chan string, len(scales))

	for _, scale := range scales {
		wg.Add(1)
		go func(scale string) {
			defer wg.Done()
			transcodeVideo(inputUrl, scale, errChan)
		}(scale)
	}

	wg.Wait()
	close(errChan)
	erroredScales := make(map[string]bool)
	for scale := range errChan {
		erroredScales[scale] = true
	}

	transcodedScales := make([]string, 0)
	for _, scale := range scales {
		if _, ok := erroredScales[scale]; !ok {
			transcodedScales = append(transcodedScales, scale)
		}
	}

	return transcodedScales
}

func extractFileName(urlStr string) string {
	u, err := url.Parse(urlStr)
	if err != nil {
		return ""
	}
	return filepath.Base(u.Path)
}
