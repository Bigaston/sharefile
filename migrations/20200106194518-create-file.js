'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomDeFichier: {
        type: Sequelize.STRING
      },
      titre: {
        type: Sequelize.STRING
      },
      mime: {
        type: Sequelize.STRING
      },
      saveDuring: {
        type: Sequelize.INTEGER
      },
      maxDl: {
        type: Sequelize.INTEGER
      },
      currentDl: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Files');
  }
};