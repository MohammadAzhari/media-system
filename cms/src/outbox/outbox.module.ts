import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutboxEvent } from './models/outbox.model';
import { OutboxService } from './outbox.service';
import { OutboxProcessorService } from './outboxProcessor.service';

@Module({
  imports: [SequelizeModule.forFeature([OutboxEvent])],
  providers: [OutboxService, OutboxProcessorService],
  exports: [OutboxService],
})
export class OutboxModule {}
