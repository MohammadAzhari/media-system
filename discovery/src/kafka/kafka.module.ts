import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConsumerService } from './kafka-consumer.service';
import { config } from 'src/config/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CONSUMER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: config.kafka.brokers,
          },
          consumer: {
            groupId: 'discovery-consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaModule {}
