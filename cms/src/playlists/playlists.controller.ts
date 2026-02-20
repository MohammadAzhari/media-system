import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() body: CreatePlaylistDto) {
    return this.playlistsService.create(body);
  }

  @Get()
  findAll(@Query() query: FindAllPlaylistsDto) {
    return this.playlistsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Query('withContents') withContents?: string) {
    return this.playlistsService.findById(id, withContents === 'true');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePlaylistDto) {
    return this.playlistsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.playlistsService.delete(id);
  }

  @Post(':id/contents/:contentId')
  addContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.playlistsService.addContent(id, contentId);
  }

  @Delete(':id/contents/:contentId')
  removeContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.playlistsService.removeContent(id, contentId);
  }
}
