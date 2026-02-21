import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { Topics } from './types/topics';
import type { ContentCreatedMessage, ContentUpdatedMessage, ContentDeletedMessage } from './types/messages';
import { EsContentIndexingService } from '../elasticsearch/es-content-indexing.service';

@Injectable()
export class KafkaConsumerService {
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private readonly esService: EsContentIndexingService) {}

  @MessagePattern(Topics.CONTENT_CREATED)
  async handleContentCreated(@Payload() message: ContentCreatedMessage, @Ctx() context: KafkaContext) {
    const partition = context.getPartition();

    this.logger.log(`Received content created message: ${JSON.stringify(message)} on partition ${partition}`);

    const result = await this.esService.indexDocument(message);

    this.logger.log(`Indexed content: ${JSON.stringify(result)}`);
  }

  @MessagePattern(Topics.CONTENT_UPDATED)
  async handleContentUpdated(@Payload() message: ContentUpdatedMessage, @Ctx() context: KafkaContext) {
    const partition = context.getPartition();

    this.logger.log(`Received content updated message: ${JSON.stringify(message)} on partition ${partition}`);

    const result = await this.esService.updateDocument(message.id, message.after);

    this.logger.log(`Updated content: ${JSON.stringify(result)}`);
  }

  @MessagePattern(Topics.CONTENT_DELETED)
  async handleContentDeleted(@Payload() message: ContentDeletedMessage, @Ctx() context: KafkaContext) {
    const partition = context.getPartition();

    this.logger.log(`Received content deleted message: ${JSON.stringify(message)} on partition ${partition}`);

    const result = await this.esService.deleteDocument(message.id);

    this.logger.log(`Deleted content: ${JSON.stringify(result)}`);
  }
}   
