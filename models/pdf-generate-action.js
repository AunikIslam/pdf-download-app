const Sequelize = require('sequelize');
const sequelize = require('../utils/database-connection');

const PdfGenerateAction = sequelize.define('pdfGenerateAction', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    action: {
        type: Sequelize.STRING,
        allowNull: false
    },
    organization_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    template_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = PdfGenerateAction;