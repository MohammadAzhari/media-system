import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Content } from './models/content.model';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [SequelizeModule.forFeature([Content])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService, SequelizeModule],
})
export class ContentModule {}
