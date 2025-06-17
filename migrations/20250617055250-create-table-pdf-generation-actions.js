'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
        {schema: 'pdf_generation', tableName: 'pdf_generation_actions'},
        {
          id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
          action: {type: Sequelize.STRING, allowNull: false},
          organization_id: {type: Sequelize.BIGINT, allowNull: false},
          template_name: {type: Sequelize.STRING, allowNull: false},
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );

      await queryInterface.sequelize.query(`
      ALTER SEQUENCE "pdf_generation"."pdf_generation_actions_id_seq" RESTART WITH 10000000000;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'pdf_generation', tableName: 'pdf_generation_actions'});
      await queryInterface.sequelize.query(`
      ALTER SEQUENCE "pdf_generation"."pdf_generation_actions_id_seq" RESTART WITH 1;
    `);
  }
};
