import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxEvent } from './models/outbox.model';
import { KafkaService } from '../kafka/kafka.service';
import { Op } from 'sequelize';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);

  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processOutbox() {
    this.logger.log('Processing outbox events');

    const events = await OutboxEvent.findAll({
      where: { processed: false },
      limit: 100,
      order: [['createdAt', 'ASC']],
    });

    if (!events.length) return;

    this.logger.log(`Processing ${events.length} outbox events`);

    for (const event of events) {
      try {
        await this.kafkaService.publish(
          event.eventType,
          JSON.parse(event.payload),
        );

        await event.update({ processed: true, processedAt: new Date() });
      } catch (err) {
        this.logger.error(
          `Failed to process outbox event ${event.id}`,
          err.stack,
        );
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupProcessedEvents() {
    const deleted = await OutboxEvent.destroy({
      where: {
        processed: true,
        processedAt: {
          [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });
    this.logger.log(`Cleaned up ${deleted} old processed outbox events`);
  }
}
