import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op, Sequelize, type WhereOptions } from 'sequelize';
import { Content } from '../content/models/content.model';
import { getPagination } from '../utils/pagination';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist, type PlaylistAttributes } from './models/playlist.model';
import { PlaylistContent } from './models/playlist-content.model';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly outboxService: OutboxService,
  ) {}

  async create(input: CreatePlaylistDto) {
    return this.sequelize.transaction(async (transaction) => {
      const playlist = await Playlist.create(
        {
          title: input.title,
          description: input.description,
        },
        { transaction },
      );

      await this.outboxService.addEvent(
        'playlist.created',
        playlist.toJSON(),
        transaction,
      );

      return playlist;
    });
  }

  async findAll(query: FindAllPlaylistsDto) {
    const { limit, offset } = getPagination(query);

    const where: WhereOptions<PlaylistAttributes> = {};

    if (query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query.search}%` } },
        { description: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    return Playlist.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async findById(id: string, withContents = false) {
    const playlist = await Playlist.findByPk(id, {
      ...(withContents
        ? { include: [{ model: Content, where: { isDeleted: false } }] }
        : {}),
    });

    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: string, input: UpdatePlaylistDto) {
    const oldPlaylist = await this.findById(id, false);

    return this.sequelize.transaction(async (transaction) => {
      const newPlaylist = await oldPlaylist.update(
        { ...input },
        { transaction },
      );

      await this.outboxService.addEvent(
        'playlist.updated',
        { id, before: oldPlaylist.toJSON(), after: newPlaylist.toJSON() },
        transaction,
      );

      return newPlaylist;
    });
  }

  async delete(id: string) {
    const playlist = await this.findById(id, false);
    return this.sequelize.transaction(async (transaction) => {
      await playlist.destroy({ transaction });

      await this.outboxService.addEvent(
        'playlist.deleted',
        { id },
        transaction,
      );

      return { id, deleted: true };
    });
  }

  async addContent(playlistId: string, contentId: string) {
    await this.findById(playlistId, false);

    const playlistContent = await PlaylistContent.findOne({
      where: { playlistId, contentId },
    });

    if (playlistContent)
      throw new BadRequestException('Content already linked');

    const content = await Content.findByPk(contentId);

    if (!content) throw new NotFoundException('Content not found');

    if (content.isDeleted)
      throw new BadRequestException('Cannot add deleted content');

    return this.sequelize.transaction(async (transaction) => {
      await PlaylistContent.create({ playlistId, contentId }, { transaction });

      await this.outboxService.addEvent(
        'playlist.content_added',
        { playlistId, contentId },
        transaction,
      );

      return { playlistId, contentId, linked: true };
    });
  }

  async removeContent(playlistId: string, contentId: string) {
    await this.findById(playlistId, false);

    return this.sequelize.transaction(async (transaction) => {
      const deleted = await PlaylistContent.destroy({
        where: { playlistId, contentId },
        transaction,
      });

      if (deleted > 0) {
        await this.outboxService.addEvent(
          'playlist.content_removed',
          { playlistId, contentId },
          transaction,
        );
      }

      return { playlistId, contentId, removed: deleted > 0 };
    });
  }
}
