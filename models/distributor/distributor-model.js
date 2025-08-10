const Sequelize = require('sequelize');
const sequelize = require('../../utils/database-connection');

const DistributorModel = sequelize.define('distributor', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: Sequelize.STRING,
    mobile: Sequelize.STRING
}, {
    tableName: 'distributors',
    schema: 'public',
    timestamps: false,
});

module.exports = DistributorModel;