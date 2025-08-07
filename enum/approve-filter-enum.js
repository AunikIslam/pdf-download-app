const ApproveFilterEnum = Object.freeze({
    ALL: 'All',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PENDING_AND_APPROVED: 'Pending and Approved',
    PENDING_AND_REJECTED: 'Pending and Rejected',
    APPROVED_AND_REJECTED: 'Approved and Rejected',
    FORWARDED: 'Forwarded',
    PENDING_AND_FORWARDED: 'Pending and Forwarded',
    APPROVED_AND_FORWARDED: 'Approved and Forwarded',
});

module.exports = ApproveFilterEnum;