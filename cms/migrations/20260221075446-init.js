'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('contents', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      mediaType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mediaUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isExternal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isMediaProcessed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      processingMetadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      externalSource: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      externalMetadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('playlists', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('outbox_events', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payload: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      processed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      processedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('playlist_contents', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
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

    // Add unique index on playlistId and contentId
    await queryInterface.addIndex('playlist_contents', ['playlistId', 'contentId'], {
      unique: true,
      name: 'playlist_contents_playlist_id_content_id_unique',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('playlist_contents');
    await queryInterface.dropTable('outbox_events');
    await queryInterface.dropTable('playlists');
    await queryInterface.dropTable('contents');
  }
};
