package main

import (
	"log"

	"github.com/MohammadAzhari/media-system/media-processor/consumer"
	"github.com/MohammadAzhari/media-system/media-processor/handler"
	"github.com/spf13/viper"
)

func main() {
	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("Could not load config: ", err)
	}

	consumer := consumer.NewConsumer(config.KafkaHost)
	consumer.Start("content.created", &handler.ContentCreatedHandler{})
	consumer.Start("content.updated", &handler.ContentUpdatedHandler{})

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
