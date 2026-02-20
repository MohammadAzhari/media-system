import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';
import { Content } from '../../content/models/content.model';
import { PlaylistContent } from './playlist-content.model';

export type PlaylistAttributes = {
  id: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PlaylistCreationAttributes = Optional<PlaylistAttributes, 'id'>;

@Table({
  tableName: 'playlists',
})
export class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> {
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

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @BelongsToMany(() => Content, () => PlaylistContent)
  contents?: Content[];
}
