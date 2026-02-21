import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { config } from '../config/config';
import { EsContentIndexingService } from './es-content-indexing.service';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: config.elasticSearch.host,
      auth: {
        username: config.elasticSearch.username,
        password: config.elasticSearch.password,
      },
    }),
  ],
  providers: [EsContentIndexingService],
  exports: [EsContentIndexingService],
})
export class ElasticsearchModule {}
