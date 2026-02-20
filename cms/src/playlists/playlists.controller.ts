import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create playlist' })
  @ApiBody({ type: CreatePlaylistDto })
  @ApiResponse({ status: 201 })
  create(@Body() body: CreatePlaylistDto) {
    return this.playlistsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List playlists' })
  @ApiQuery({ name: 'query', type: FindAllPlaylistsDto, required: false })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: FindAllPlaylistsDto) {
    return this.playlistsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'withContents', required: false, type: Boolean })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findById(@Param('id') id: string, @Query('withContents') withContents?: string) {
    return this.playlistsService.findById(id, withContents === 'true');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update playlist' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePlaylistDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  update(@Param('id') id: string, @Body() body: UpdatePlaylistDto) {
    return this.playlistsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete playlist' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  delete(@Param('id') id: string) {
    return this.playlistsService.delete(id);
  }

  @Post(':id/contents/:contentId')
  @ApiOperation({ summary: 'Add content to playlist' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'contentId', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  addContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.playlistsService.addContent(id, contentId);
  }

  @Delete(':id/contents/:contentId')
  @ApiOperation({ summary: 'Remove content from playlist' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'contentId', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  removeContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.playlistsService.removeContent(id, contentId);
  }
}
