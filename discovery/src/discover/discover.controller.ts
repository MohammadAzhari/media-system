import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EsContentIndexingService } from '../elasticsearch/es-content-indexing.service';

@ApiTags('Discover')
@Controller('discover')
export class DiscoverController {
  constructor(private readonly esService: EsContentIndexingService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for content' })
  @ApiQuery({ name: 'q', description: 'Search query string', required: true, type: String })
  @ApiResponse({ status: 200, description: 'List of matching content documents' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async search(@Query('q') query: string) {
    return this.esService.search(query);
  }
}
