import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as ES } from '@nestjs/elasticsearch';
import { contentIndexMappings } from './models/contentIndexMappings';
import { Logger } from '@nestjs/common';
import { ContentAttributes } from '../types/content'

@Injectable()
export class EsContentIndexingService implements OnModuleInit {
  private readonly index = 'contents';
  private readonly logger = new Logger(EsContentIndexingService.name);

  constructor(private readonly es: ES) {}

  async onModuleInit() {
    await this.ensureIndex();
  }

  async ensureIndex() {
    const exists = await this.es.indices.exists({ index: this.index });

    if (!exists) {
      await this.es.indices.create({
        index: this.index,
        mappings: contentIndexMappings,
      });

      this.logger.log(`Index created: ${this.index}`);
    }
  }

  async indexDocument(doc: ContentAttributes) {
    await this.es.index({
      index: this.index,
      id: doc.id,
      document: doc,
      refresh: true,
    });
  }

  async updateDocument(id: string, partial: ContentAttributes) {
    await this.es.update({
      index: this.index,
      id,
      doc: partial,
      refresh: true,
    });
  }

  async deleteDocument(id: string) {
    await this.es.delete({
      index: this.index,
      id,
      refresh: true,
    });
  }

  async search(query: string) {
    const result = await this.es.search({
      index: this.index,
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'description', 'tags'],
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  async findById(id: string) {
    const result = await this.es.get({
      index: this.index,
      id,
    });

    return result._source;
  }
}
