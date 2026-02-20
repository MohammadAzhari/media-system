import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';
import { Playlist } from './playlist.model';
import { Content } from '../../content/models/content.model';

export type PlaylistContentAttributes = {
  id: string;
  playlistId: string;
  contentId: string;
};

export type PlaylistContentCreationAttributes = Optional<PlaylistContentAttributes, 'id'>;

@Table({
  tableName: 'playlist_contents',
  timestamps: false,
})
export class PlaylistContent extends Model<
  PlaylistContentAttributes,
  PlaylistContentCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index({ name: 'playlist_contents_playlist_id_content_id_unique', unique: true })
  @ForeignKey(() => Playlist)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare playlistId: string;

  @Index({ name: 'playlist_contents_playlist_id_content_id_unique', unique: true })
  @ForeignKey(() => Content)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare contentId: string;
}
