package handler

import (
	"context"
	"encoding/json"

	"github.com/MohammadAzhari/media-system/media-processor/services"
)

type ContentCreatedHandler struct{
	CMSService *services.CMSService
}

type ContentCreatedEvent struct {
	ContentData
}

func NewContentCreatedHandler(cmsService *services.CMSService) *ContentCreatedHandler {
	return &ContentCreatedHandler{CMSService: cmsService}
}

func (h *ContentCreatedHandler) Process(ctx context.Context, msg []byte) error {
	var event ContentCreatedEvent
	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	if event.IsMediaProcessed {
		return nil
	}

	return h.CMSService.ProcessContent(event.ID, event.MediaUrl)
}
