import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Op, type WhereOptions } from 'sequelize';
import { Content } from '../content/models/content.model';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist, type PlaylistAttributes } from './models/playlist.model';
import { PlaylistContent } from './models/playlist-content.model';

@Injectable()
export class PlaylistsService {
  constructor() {}

  async create(input: CreatePlaylistDto) {
    return Playlist.create(
      {
        title: input.title,
        description: input.description,
      },
      {},
    );
  }

  async findAll(query: FindAllPlaylistsDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;

    const where: WhereOptions<PlaylistAttributes> = {};
    if (query.search) {
      (where as Record<string | symbol, unknown>)[Op.or] = [
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
      include: withContents
        ? [
            {
              model: Content,
              through: { attributes: [] },
            },
          ]
        : undefined,
    });

    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: string, input: UpdatePlaylistDto) {
    const playlist = await this.findById(id, false);
    await playlist.update({ ...input });
    return playlist;
  }

  async delete(id: string) {
    const playlist = await this.findById(id, false);
    await playlist.destroy();
    return { id, deleted: true };
  }

  async addContent(playlistId: string, contentId: string) {
    await this.findById(playlistId, false);
    const content = await Content.findByPk(contentId);
    if (!content) throw new NotFoundException('Content not found');
    if (content.isDeleted) throw new BadRequestException('Cannot add deleted content');

    await PlaylistContent.findOrCreate({
      where: { playlistId, contentId },
      defaults: { playlistId, contentId },
    });

    return { playlistId, contentId, linked: true };
  }

  async removeContent(playlistId: string, contentId: string) {
    await this.findById(playlistId, false);

    const deleted = await PlaylistContent.destroy({ where: { playlistId, contentId } });

    return { playlistId, contentId, removed: deleted > 0 };
  }
}
