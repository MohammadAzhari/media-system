import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaylistContent } from './models/playlist-content.model'
import { Playlist } from './models/playlist.model'
import { Content } from '../content/models/content.model'
import { OutboxModule } from 'src/outbox/outbox.module'
import { OutboxService } from 'src/outbox/outbox.service'

@Module({
  imports: [SequelizeModule.forFeature([PlaylistContent, Playlist, Content]), OutboxModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, OutboxService],
})
export class PlaylistsModule {}
