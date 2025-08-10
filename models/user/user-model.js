const Sequelize = require('sequelize');
const sequelize = require('../../utils/database-connection');
const roleModel = require('../../models/user/role-model')

const UserModel = sequelize.define('user', {
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    code: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    mobile: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    phone: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    designation: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    userRoleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'user_role_id'
    },
    userType: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'user_type'
    },
    joiningDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'joining_date'
    },
    resignationDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'resignation_date'
    },
    remarks: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    distributorId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'distributor_id'
    },
    customerId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'customer_id'
    },
    approvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'approved_at'
    },
    referenceCode: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'reference_code'
    },
    attendanceLat: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        field: 'attendance_lat'
    },
    attendanceLon: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        field: 'attendance_lon'
    },
    attendanceLocInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'attendance_loc_info'
    },
    dealerId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'dealer_id'
    },
    statusFlag: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'status_flag'
    }
}, {
    tableName: 'users',
    schema: 'public',
    timestamps: false,
});

UserModel.prototype.markets = [];
UserModel.prototype.userRole = new roleModel();
module.exports = UserModel;