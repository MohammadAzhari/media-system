package consumer

import (
	"context"
	"log"

	"github.com/IBM/sarama"
)
type EventHandler interface {
	Process(ctx context.Context, msg []byte) error
}

type ConsumerGroupHandler struct {
	handler EventHandler
}

func (ConsumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error {
	log.Println("Consumer group is being rebalanced")
	return nil
}

func (ConsumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error {
	log.Println("Rebalancing will happen soon, current session will end")
	return nil
}

func (h ConsumerGroupHandler) ConsumeClaim(sess sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for msg := range claim.Messages() {
		key := string(msg.Key)
		log.Printf("Message claimed: key=%s topic=%q partition=%d offset=%d\n", key, msg.Topic, msg.Partition, msg.Offset)

		if err := h.handler.Process(context.Background(), msg.Value); err != nil {
			log.Printf("Error processing message from topic %s: %v", msg.Topic, err)
			continue
		}

		sess.MarkMessage(msg, "")
	}
	return nil
}
