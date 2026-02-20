package handler

import (
	"context"
	"encoding/json"
)


type ContentUpdatedHandler struct{}

type ContentUpdatedEvent struct {
	ID string `json:"id"`
}

func (h *ContentUpdatedHandler) Process(ctx context.Context, msg []byte) error {
	var event ContentUpdatedEvent
	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	return nil
}