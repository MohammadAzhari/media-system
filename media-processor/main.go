package main

import (
	"log"

	"github.com/MohammadAzhari/media-system/media-processor/consumer"
	"github.com/MohammadAzhari/media-system/media-processor/handler"
	"github.com/MohammadAzhari/media-system/media-processor/services"
	"github.com/spf13/viper"
)

func main() {
	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("Could not load config: ", err)
	}

	contentCreatedConsumer := consumer.NewConsumer(config.KafkaHost, "content-created")
	contentUpdatedConsumer := consumer.NewConsumer(config.KafkaHost, "content-updated")

	cmsService := services.NewCMSService(config.CmsAddress)

	createdHandler := handler.NewContentCreatedHandler(cmsService)
	updatedHandler := handler.NewContentUpdatedHandler(cmsService)

	go contentCreatedConsumer.Start("content.created", createdHandler)
	go contentUpdatedConsumer.Start("content.updated", updatedHandler)

	select {}
}

type Config struct {
	KafkaHost           string `mapstructure:"KAFKA_HOST"`
	CmsAddress          string `mapstructure:"CMS_ADDRESS"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
