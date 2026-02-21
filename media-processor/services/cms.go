package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MohammadAzhari/media-system/media-processor/transcoder"
)

type CMSService struct {
	CmsAddress string
}

func NewCMSService(cmsAddress string) *CMSService {
	return &CMSService{CmsAddress: cmsAddress}
}

func (s *CMSService) ProcessContent(id, url string) error {
	metadata, err := transcoder.Transcode(url)
	if err != nil {
		return err
	}

	return s.markAsProcessed(id, metadata)
}

type MarkAsProcessedRequest struct {
	ProcessingMetadata *transcoder.VideoMetadata `json:"processingMetadata"`
}

func (s *CMSService) markAsProcessed(id string, processingMetadata *transcoder.VideoMetadata) error {
	reqBody := MarkAsProcessedRequest{
		ProcessingMetadata: processingMetadata,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/contents/%s/mark-as-processed", s.CmsAddress, id)
	req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("mark as processed failed with status %d", resp.StatusCode)
	}

	return nil
}


