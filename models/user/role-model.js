const userTypeEnum = require('../../enum/user-type-enum');
const UserTypeEnum = require("../../enum/user-type-enum");
class RoleModel {
    constructor(id = null, isActive = true, name = null, marketLevelId = null, userType = null) {
        this.id = id;
        this.isActive = isActive;
        this.name = name;
        this.userType = userType;
        this.isActive = isActive;
        this.userType = userType;
    }
}

module.exports = RoleModel;