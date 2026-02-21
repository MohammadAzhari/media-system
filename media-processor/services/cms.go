package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"sync"

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

	var wg sync.WaitGroup
	errChan := make(chan error, len(metadata.SuccessScales))

	for _, scale := range metadata.SuccessScales {
		wg.Add(1)
		go func(scale string) {
			defer wg.Done()
			uploadResp, err := s.uploadFile(metadata.OutputFiles[scale])
			metadata.OutputFiles[scale] = s.CmsAddress + "/uploads/" + uploadResp.Filename
			if err != nil {
				errChan <- err
			}
		}(scale)
	}

	wg.Wait()
	close(errChan)

	select {
	case err := <-errChan:
		return err
	default:
	}

	metadataBytes, err := json.Marshal(metadata)
	if err != nil {
		return err
	}

	var processingMetadata map[string]interface{}
	err = json.Unmarshal(metadataBytes, &processingMetadata)
	if err != nil {
		return err
	}

	return s.markAsProcessed(id, processingMetadata)
}

type UploadResponse struct {
	Message string `json:"message"`
	Filename string `json:"filename"`
}

func (s *CMSService) uploadFile(filePath string) (*UploadResponse, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var b bytes.Buffer
	writer := multipart.NewWriter(&b)

	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		return nil, err
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}

	writer.Close()

	req, err := http.NewRequest("POST", s.CmsAddress+"/upload/single", &b)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("upload failed with status %d", resp.StatusCode)
	}

	var uploadResp UploadResponse
	err = json.NewDecoder(resp.Body).Decode(&uploadResp)
	if err != nil {
		return nil, err
	}

	return &uploadResp, nil
}

type MarkAsProcessedRequest struct {
	ProcessingMetadata map[string]interface{} `json:"processingMetadata"`
}

func (s *CMSService) markAsProcessed(id string, processingMetadata map[string]interface{}) error {
	reqBody := MarkAsProcessedRequest{
		ProcessingMetadata: processingMetadata,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/content/%s/mark-as-processed", s.CmsAddress, id)
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


