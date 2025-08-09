const environmentConfig = require('../config/environment-config');
const constants = require('../utils/constants');
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
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    });
}
exports.prepareApiUrl = (api, baseUrl) => {
    return environmentConfig.externalApiUrl + baseUrl + api;
}

exports.convertNumberToWords = (value) => {
    const convertedToString = value.toFixed(2);
    const decimalPart = convertedToString.split('.')[1];
    const nonDecimalPart = convertedToString.split('.')[0].split('');
    const tenthSection = nonDecimalPart.splice(nonDecimalPart.length - 2, 2).join('');
    const hundredSection = nonDecimalPart.splice(nonDecimalPart.length - 1, 1).join('');
    const thousandSection = nonDecimalPart.splice(nonDecimalPart.length - 2, 2).join('');
    const lacSection = nonDecimalPart.splice(nonDecimalPart.length - 2, 2).join('');

    const getFractionText = (value) => {
        return constants.numberWords[parseInt(value, 10)];
    }
    const getTenthSectionText = (pValue) => {
        if (constants.numberWords[parseInt(pValue, 10)]) {
            return constants.numberWords[parseInt(pValue, 10)];
        } else {
            return ``;
        }
    }

    const getHundredSectionText = (pValue) => {
        if (constants.numberWords[parseInt(pValue, 10)]) {
            return `${constants.numberWords[parseInt(pValue, 10)]} Hundred `;
        } else {
            return ``;
        }
    }

    const getThousandSectionText = (pValue) => {
        if (constants.numberWords[parseInt(pValue, 10)]) {
            return `${constants.numberWords[parseInt(pValue, 10)]} Thousand `;
        } else {
            return ``;
        }
    }

    const getLacSectionText = (pValue) => {
        if (constants.numberWords[parseInt(pValue, 10)]) {
            return `${constants.numberWords[parseInt(pValue, 10)]} Lac `;
        } else {
            return ``;
        }
    }
    return `${getLacSectionText(lacSection)}${getThousandSectionText(thousandSection)}${getHundredSectionText(hundredSection)}${getTenthSectionText(tenthSection)} Taka and ${getFractionText(decimalPart)} Paisa`;
}

exports.findEnumOrdinal = (pEnum, value) => {
    const enumMap = new Map();
    if (value == null) {
        return 0;
    }
    Object.keys(pEnum).map((value, index) => {
        enumMap.set(value, index);
    });

    return enumMap.get(value);
}

exports.parseParams = (params) => {
    Object.keys(params).forEach((key) => {
        try {
            if (params[key] === 'string' || params[key] === '' || params[key] === 'null') {
                params[key] = null;
                return;
            }
            params[key] = JSON.parse(params[key]);
        } catch (err) {

        }
    });
    return params;
}
