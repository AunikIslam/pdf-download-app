const UserTypeEnum = Object.freeze({
    ORGANIZATION_USER: 'All',
    DISTRIBUTOR_USER: 'Pending',
    DEALER_USER: 'Approved',
    CUSTOMER_USER: 'Rejected',
    DSR_USER: 'Pending and Approved'
});

module.exports = UserTypeEnum;