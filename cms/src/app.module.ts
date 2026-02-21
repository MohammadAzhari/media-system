import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { Content } from './content/models/content.model';
import { Playlist } from './playlists/models/playlist.model';
import { PlaylistContent } from './playlists/models/playlist-content.model';
import { ContentModule } from './content/content.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { config } from './config/config';
import { UploadModule } from './upload/upload.module';
import { KafkaModule } from './kafka/kafka.module';
import { OutboxModule } from './outbox/outbox.module';
import { OutboxEvent } from './outbox/models/outbox.model'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      database: config.db.name,
      autoLoadModels: true,
      synchronize: false,
      models: [Content, Playlist, PlaylistContent, OutboxEvent],
      logging: false,
    }),
    ScheduleModule.forRoot(),
    ContentModule,
    PlaylistsModule,
    UploadModule,
    KafkaModule,
    OutboxModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
