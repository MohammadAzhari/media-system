import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaModule } from './kafka/kafka.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { DiscoverModule } from './discover/discover.module';

@Module({
  imports: [KafkaModule, ElasticsearchModule, DiscoverModule],
  controllers: [AppController],
})
export class AppModule {}
