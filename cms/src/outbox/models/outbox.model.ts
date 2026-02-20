import { Optional } from 'sequelize'
import { Table, Column, DataType, Model } from 'sequelize-typescript';

export type OutboxEventAttributes = {
  id: string;
  eventType: string;
  payload: string;
  processed: boolean;
  processedAt: Date | null;
};

export type OutboxEventCreationAttributes = Optional<OutboxEventAttributes, 'id' | 'processed' | 'processedAt'>;

@Table({
  tableName: 'outbox_events',
  timestamps: true,
})
export class OutboxEvent extends Model<OutboxEventAttributes, OutboxEventCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column(DataType.STRING)
  declare eventType: string;

  @Column(DataType.TEXT)
  declare payload: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare processed: boolean;

  @Column(DataType.DATE)
  declare processedAt: Date | null;
}
