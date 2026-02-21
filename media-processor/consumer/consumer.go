package consumer

import (
	"context"
	"log"
	"time"

	"github.com/IBM/sarama"
)

type Consumer struct {
	group sarama.ConsumerGroup
}

func NewConsumer(kafkaHost string, groupID string) *Consumer {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	config.Consumer.Offsets.Initial = sarama.OffsetOldest
	broker := kafkaHost

	var group sarama.ConsumerGroup
	var err error

	for i := 0; i < 10; i++ {
		group, err = sarama.NewConsumerGroup([]string{broker}, groupID, config)
		if err == nil {
			break
		}
		log.Print("Could not connect to Kafka: ", err)
		time.Sleep(time.Duration(i) * time.Second)
	}

	if err != nil {
		panic(err)
	}

	return &Consumer{
		group: group,
	}
}

func (c *Consumer) Start(topic string, handler EventHandler) {
	log.Println("Starting consumer for topic: ", topic)
	ctx := context.Background()
	go func() {
		for {
			topics := []string{topic}
			consumerGroupHandler := &ConsumerGroupHandler{
				handler: handler,
			}

			c.group.Consume(ctx, topics, consumerGroupHandler)
		}
	}()
}

func (c *Consumer) Close() {
	c.group.Close()
}
