import { Injectable, NotFoundException } from '@nestjs/common';
import { Op, type WhereOptions } from 'sequelize';
import { getPagination } from '../utils/pagination';
import { Content, type ContentAttributes } from './models/content.model';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor() {}

  async create(input: CreateContentDto) {
    return Content.create(
      {
        title: input.title,
        description: input.description,
        tags: input.tags ?? [],
        mediaType: input.mediaType,
        mediaUrl: input.mediaUrl,
        processingStatus: input.processingStatus ?? 'pending',
        isDeleted: input.isDeleted ?? false,
        metadata: input.metadata,
      },
      {},
    );
  }

  async findAll(query: FindAllContentDto) {
    const { limit, offset } = getPagination(query);

    const where: WhereOptions<ContentAttributes> = {};

    if (!query.includeDeleted) where.isDeleted = false;

    if (query.mediaType) where.mediaType = query.mediaType;
    if (query.processingStatus) where.processingStatus = query.processingStatus;

    if (query.tag) {
      where.tags = { [Op.contains]: [query.tag] } as unknown as ContentAttributes['tags'];
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
    const content = await this.findById(id);
    await content.update({
      ...input,
      tags: input.tags ?? content.tags,
    });
    return content;
  }

  async softDelete(id: string) {
    const content = await this.findById(id);
    await content.update({ isDeleted: true });
    return { id, isDeleted: true };
  }
}
