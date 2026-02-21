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
  mediaType: MediaType;
  mediaUrl: string;
  isDeleted: boolean;
  isExternal: boolean;
  isMediaProcessed: boolean;
  language?: string;
  processingMetadata?: Record<string, unknown>;
  externalSource?: string;
  externalMetadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
}

export type ContentCreationAttributes = Optional<
  ContentAttributes,
  'id' | 'tags' | 'isDeleted' | 'isExternal' | 'isMediaProcessed'
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
  declare mediaType: MediaType;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare mediaUrl: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isExternal: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isMediaProcessed: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare language?: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare processingMetadata?: Record<string, unknown>;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare externalSource?: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare externalMetadata?: Record<string, unknown>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @BelongsToMany(() => Playlist, () => PlaylistContent)
  playlists?: Playlist[];
}
