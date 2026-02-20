'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('playlist_contents', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      playlistId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'playlists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      contentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'contents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex('playlist_contents', {
      name: 'playlist_contents_playlist_id_content_id_unique',
      unique: true,
      fields: ['playlistId', 'contentId'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('playlist_contents');
  },
};
