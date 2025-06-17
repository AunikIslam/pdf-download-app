'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS pdf_generation`);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP SCHEMA IF EXISTS pdf_generation CASCADE`);
    },
    useTransaction: false
};
