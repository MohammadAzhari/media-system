import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() body: CreateContentDto) {
    return this.contentService.create(body);
  }

  @Get()
  findAll(@Query() query: FindAllContentDto) {
    return this.contentService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.contentService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateContentDto) {
    return this.contentService.update(id, body);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.contentService.softDelete(id);
  }
}
