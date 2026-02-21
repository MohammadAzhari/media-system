import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutboxEvent } from './models/outbox.model';
import { OutboxService } from './outbox.service';
import { OutboxProcessorService } from './outboxProcessor.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    SequelizeModule.forFeature([OutboxEvent]),
    KafkaModule
  ],
  providers: [OutboxService, OutboxProcessorService],
})
export class OutboxModule {}
