const Sequelize = require('sequelize');
const sequelize = require('../../utils/database-connection');

const RetailerModel = sequelize.define('retailer', {
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
    ownerName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'owner_name'
    },
    ownerPhone: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'owner_phone'
    },
    address: Sequelize.STRING,
    phone: Sequelize.STRING,
    mobile: Sequelize.STRING
}, {
    tableName: 'customers',
    schema: 'public',
    timestamps: false,
});

module.exports = RetailerModel;