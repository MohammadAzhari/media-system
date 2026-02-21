import { Injectable, NotFoundException } from '@nestjs/common';
import { Op, Sequelize, type WhereOptions } from 'sequelize';
import { getPagination } from '../utils/pagination';
import { Content, type ContentAttributes } from './models/content.model';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { MarkAsProcessedDto, UpdateContentDto } from './dto/update-content.dto';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class ContentService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly outboxService: OutboxService,
  ) {}

  async create(input: CreateContentDto) {
    return this.sequelize.transaction(async (transaction) => {
      const content = await Content.create(
        {
          ...input,
          isMediaProcessed: input.isExternal, // External content doesn't need to be processed
        },
        { transaction },
      );

      await this.outboxService.addEvent(
        'content.created',
        content.toJSON(),
        transaction,
      );

      return content;
    });
  }

  async findAll(query: FindAllContentDto) {
    const { limit, offset } = getPagination(query);

    const where: WhereOptions<ContentAttributes> = {};

    if (!query.includeDeleted) where.isDeleted = false;

    if (query.mediaType) where.mediaType = query.mediaType;
    if (query.isMediaProcessed) where.isMediaProcessed = query.isMediaProcessed;

    if (query.tag) {
      where.tags = { [Op.contains]: [query.tag] };
    }

    if (query.search) {
      (where as Record<string | symbol, unknown>)[Op.or] = [
        { title: { [Op.iLike]: `%${query.search}%` } },
        { description: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    return Content.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async findById(id: string) {
    const content = await Content.findByPk(id);
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async update(id: string, input: UpdateContentDto) {
    const oldContent = await this.findById(id);

    return this.sequelize.transaction(async (transaction) => {
      const newContent = await oldContent.update({
        ...input,
        tags: input.tags ?? oldContent.tags,
      });

      await this.outboxService.addEvent(
        'content.updated',
        { id, before: oldContent.toJSON(), after: newContent.toJSON() },
        transaction,
      );

      return newContent;
    });
  }

  async markAsProcessed(
    id: string,
    input: MarkAsProcessedDto,
  ) {
    const oldContent = await this.findById(id);

    return this.sequelize.transaction(async (transaction) => {
      const newContent = await oldContent.update({
        isMediaProcessed: true,
        processingMetadata: input.processingMetadata,
      });

      await this.outboxService.addEvent(
        'content.updated',
        { id, before: oldContent.toJSON(), after: newContent.toJSON() },
        transaction,
      );

      return newContent;
    });
  }

  async softDelete(id: string) {
    const content = await this.findById(id);
    return this.sequelize.transaction(async (transaction) => {
      await content.update({ isDeleted: true });

      await this.outboxService.addEvent('content.deleted', { id }, transaction);

      return { id, isDeleted: true };
    });
  }
}
