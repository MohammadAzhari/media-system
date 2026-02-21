package handler

import (
	"context"
	"encoding/json"

	"github.com/MohammadAzhari/media-system/media-processor/services"
)


type ContentUpdatedHandler struct {
	CMSService *services.CMSService
}

type ContentData struct {
	ID                  string                 `json:"id"`
	Title               string                 `json:"title"`
	Description         *string                `json:"description,omitempty"`
	Tags                []string               `json:"tags"`
	MediaType           string                 `json:"mediaType"`
	MediaUrl            string                 `json:"mediaUrl"`
	IsDeleted           bool                   `json:"isDeleted"`
	IsExternal          bool                   `json:"isExternal"`
	IsMediaProcessed    bool                   `json:"isMediaProcessed"`
	Language            *string                `json:"language,omitempty"`
	ProcessingMetadata  map[string]interface{} `json:"processingMetadata,omitempty"`
	ExternalSource      *string                `json:"externalSource,omitempty"`
	ExternalMetadata    map[string]interface{} `json:"externalMetadata,omitempty"`
	CreatedAt           string                 `json:"createdAt,omitempty"`
	UpdatedAt           string                 `json:"updatedAt,omitempty"`
}

type ContentUpdatedEvent struct {
	ID     string     `json:"id"`
	Before ContentData `json:"before"`
	After  ContentData `json:"after"`
}

func NewContentUpdatedHandler(cmsService *services.CMSService) *ContentUpdatedHandler {
	return &ContentUpdatedHandler{CMSService: cmsService}
}

func (h *ContentUpdatedHandler) Process(ctx context.Context, msg []byte) error {
	var event ContentUpdatedEvent
	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	if event.After.IsMediaProcessed {
		return nil
	}

	return h.CMSService.ProcessContent(event.ID, event.After.MediaUrl)
}