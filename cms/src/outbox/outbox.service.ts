import { Injectable } from '@nestjs/common';
import { OutboxEvent } from './models/outbox.model';
import { Transaction } from 'sequelize'

@Injectable()
export class OutboxService {
  async addEvent<T>(
    eventType: string,
    payload: T,
    transaction: Transaction,
  ): Promise<void> {
    await OutboxEvent.create(
      {
        eventType,
        payload: JSON.stringify(payload),
      },
      { transaction },
    );
  }
}
