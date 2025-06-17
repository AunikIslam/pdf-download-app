'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
        {schema: 'pdf_generation', tableName: 'pdf_generation_actions'},
        {
          id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          action: {type: Sequelize.STRING, allowNull: false},
          organization_id: {type: Sequelize.STRING, allowNull: false},
          template_name: {type: Sequelize.STRING, allowNull: false},
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'pdf_generation', tableName: 'pdf_generation_actions'});
  }
};
