import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { MarkAsProcessedDto, UpdateContentDto } from './dto/update-content.dto';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create content' })
  @ApiBody({ type: CreateContentDto })
  @ApiResponse({ status: 201 })
  create(@Body() body: CreateContentDto) {
    return this.contentService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List contents' })
  @ApiQuery({ name: 'query', type: FindAllContentDto, required: false })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: FindAllContentDto) {
    return this.contentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findById(@Param('id') id: string) {
    return this.contentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateContentDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  update(@Param('id') id: string, @Body() body: UpdateContentDto) {
    return this.contentService.update(id, body);
  }

  @Patch(':id/mark-as-processed')
  @ApiOperation({ summary: 'Mark as Processed' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: MarkAsProcessedDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  markAsProcessed(@Param('id') id: string, @Body() body: MarkAsProcessedDto) {
    return this.contentService.markAsProcessed(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete content' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  softDelete(@Param('id') id: string) {
    return this.contentService.softDelete(id);
  }
}
