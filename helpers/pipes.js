const {format} = require('date-fns');

exports.datePipe = (date, dateFormate) => {
    return format(date, dateFormate);
}

exports.booleanPipe = (value) => {
    if (value) {
        return 'Yes'
    } else {
        return 'No'
    }
}

exports.approvalPipe = (value) => {
    if (value != null) {
        return value === true ? 'Approved' : 'Rejected';
    }
    return 'Pending';
}

exports.currencyPipe = (value) => {
    return value.toLocaleString('en-IN', {
       minimumFractionDigits: 0,
       maximumFractionDigits: 2
    });
}