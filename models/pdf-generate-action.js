const Sequelize = require('sequelize');
const sequelize = require('../utils/database-connection');

const PdfGenerateAction = sequelize.define('pdf_generation_action', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
}, {
    schema: 'pdf_generation'
});

module.exports = PdfGenerateAction;