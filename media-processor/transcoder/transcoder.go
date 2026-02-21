package transcoder
type VideoMetadata struct {
	Duration  float64 `json:"duration"`
	Width     int     `json:"width"`
	Height    int     `json:"height"`
	SizeBytes int64   `json:"size_bytes"`
	Format    string  `json:"format"`
	Url       string  `json:"url"`
}

// This is a mock implementation of the transcoder
func Transcode(inputUrl string) (*VideoMetadata, error) {
	return &VideoMetadata{
		Duration: 10,
		Width: 1920,
		Height: 1080,
		SizeBytes: 1024,
		Format: "h264",
		Url: inputUrl,
	}, nil
}