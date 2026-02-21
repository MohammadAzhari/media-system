import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaylistContent } from './models/playlist-content.model'
import { Playlist } from './models/playlist.model'
import { Content } from '../content/models/content.model'

@Module({
  imports: [SequelizeModule.forFeature([PlaylistContent, Playlist, Content])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
