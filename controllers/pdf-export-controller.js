const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const pdfGenerateAction = require('../models/pdf-generate-action');
const fs = require('fs').promises;
const TemplateListResponse = require('../models/template-list-response');
const ApiResponse = require('../models/api-response');
const dummyDataSet = require('../utils/dummy-data-set');
const pipes = require('../helpers/pipes');
const PdfGenerateAction = require('../models/pdf-generate-action');
const TemplateAddRequest = require('../models/template-add-request');
const BaseService = require('../services/base-service');
const endpoints = require('../config/endpoints');
const utilFunctions = require('../utils/util-functions');
const baseUrls = require('../config/base-urls');

exports.exportSecondaryOrderDetails = async (req, res) => {
    try {
        const secondaryOrder = await BaseService.getSecondaryOrderDetails(utilFunctions
            .prepareApiUrl(`${endpoints.secondary_order_details}/${req.params.orderId}`, baseUrls.sfa_url));

    } catch (error) {
        console.log(`Error from secondary order pdf export controller ${error.message}`);
    }
}