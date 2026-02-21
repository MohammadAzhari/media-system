package transcoder

import (
	"encoding/json"
	"log"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
)

// -------------------------------
// PUBLIC API
// -------------------------------
func Transcode(inputUrl string) (*VideoMetadata, error) {
	var wg sync.WaitGroup
	errChan := make(chan string, len(scales))
	outChan := make(chan string, len(scales))

	// Start workers
	for _, scale := range scales {
		wg.Add(1)
		go func(scale string) {
			defer wg.Done()
			transcodeVideo(inputUrl, scale, errChan, outChan)
		}(scale)
	}

	wg.Wait()
	close(errChan)
	close(outChan)

	errored := map[string]bool{}
	for sc := range errChan {
		errored[sc] = true
	}

	md := &VideoMetadata{
		OutputFiles:   map[string]string{},
		SuccessScales: []string{},
	}

	// Collect output paths
	for item := range outChan {
		parts := strings.Split(item, "|")
		scale := parts[0]
		path := parts[1]

		if !errored[scale] {
			md.OutputFiles[scale] = path
			md.SuccessScales = append(md.SuccessScales, scale)
		}
	}

	// Collect original video metadata
	original, err := getVideoMetadata(inputUrl)
	if err != nil {
		return nil, err
	}

	md.Duration = original.Duration
	md.Width = original.Width
	md.Height = original.Height
	md.SizeBytes = original.SizeBytes
	md.Format = original.Format

	return md, nil
}

// -------------------------------
// CONFIG
// -------------------------------
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

// -------------------------------
// DATA MODEL
// -------------------------------
type VideoMetadata struct {
	Duration      float64            `json:"duration"`
	Width         int                `json:"width"`
	Height        int                `json:"height"`
	SizeBytes     int64              `json:"size_bytes"`
	Format        string             `json:"format"`
	OutputFiles   map[string]string  `json:"output_files"`
	SuccessScales []string           `json:"success_scales"`
}

// -------------------------------
// HELPERS
// -------------------------------
func extractFileName(urlStr string) string {
	u, err := url.Parse(urlStr)
	if err != nil {
		return ""
	}
	return filepath.Base(u.Path)
}

func getVideoMetadata(path string) (*VideoMetadata, error) {
	cmd := exec.Command("ffprobe",
		"-v", "error",
		"-show_entries", "format=size,duration:stream=width,height",
		"-of", "json",
		path,
	)

	out, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	var probe struct {
		Streams []struct {
			Width  int `json:"width"`
			Height int `json:"height"`
		} `json:"streams"`
		Format struct {
			Duration string `json:"duration"`
			Size     string `json:"size"`
			Format   string `json:"format_name"`
		} `json:"format"`
	}

	if err := json.Unmarshal(out, &probe); err != nil {
		return nil, err
	}

	size, _ := strconv.ParseInt(probe.Format.Size, 10, 64)
	duration, _ := strconv.ParseFloat(probe.Format.Duration, 64)

	return &VideoMetadata{
		Duration:  duration,
		Width:     probe.Streams[0].Width,
		Height:    probe.Streams[0].Height,
		SizeBytes: size,
		Format:    probe.Format.Format,
	}, nil
}

// -------------------------------
// TRANSCODER WORKER
// -------------------------------
func transcodeVideo(inputUrl, scale string, errCh chan string, outCh chan string) {
	outputFileName := extractFileName(inputUrl) + "_" + scale + ".mp4"
	outputPath := "uploads/" + outputFileName

	cmd := exec.Command("ffmpeg", "-i", inputUrl,
		"-vf", scalesMap[scale], "-c:v", "libx264", "-crf", "23",
		"-c:a", "copy", outputPath)

	err := cmd.Run()
	if err != nil {
		log.Printf("Error transcoding %v: %v", scale, err)
		errCh <- scale
		return
	}

	if _, err := os.Stat(outputPath); err != nil {
		log.Printf("File missing after transcode: %v (%v)", scale, err)
		errCh <- scale
		return
	}

	outCh <- scale + "|" + outputPath
}