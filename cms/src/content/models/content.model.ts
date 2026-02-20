import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';
import { Playlist } from '../../playlists/models/playlist.model';
import { PlaylistContent } from '../../playlists/models/playlist-content.model';

export type ContentAttributes = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  mediaType: string;
  mediaUrl: string;
  processingStatus: string;
  isDeleted: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ContentCreationAttributes = Optional<
  ContentAttributes,
  'id' | 'tags' | 'processingStatus' | 'isDeleted' | 'metadata'
>;

@Table({
  tableName: 'contents',
})
export class Content extends Model<ContentAttributes, ContentCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  declare tags: string[];

  @AllowNull(false)
  @Column(DataType.STRING)
  declare mediaType: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare mediaUrl: string;

  @AllowNull(false)
  @Default('pending')
  @Column(DataType.STRING)
  declare processingStatus: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare metadata?: Record<string, unknown>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @BelongsToMany(() => Playlist, () => PlaylistContent)
  playlists?: Playlist[];
}
