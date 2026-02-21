import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Content } from './models/content.model';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { OutboxModule } from 'src/outbox/outbox.module';
import { OutboxService } from 'src/outbox/outbox.service'

@Module({
  imports: [SequelizeModule.forFeature([Content]), OutboxModule],
  controllers: [ContentController],
  providers: [ContentService, OutboxService],
})
export class ContentModule {}
