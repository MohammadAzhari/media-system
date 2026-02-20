package handler

import (
	"context"
	"encoding/json"
)

type ContentCreatedHandler struct{}

type ContentCreatedEvent struct {
	ID string `json:"id"`
}

func (h *ContentCreatedHandler) Process(ctx context.Context, msg []byte) error {
	var event ContentCreatedEvent
	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	return nil
}