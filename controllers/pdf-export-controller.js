const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const pdfGenerateAction = require('../models/pdf-generate-action');
const fs = require('fs');
const TemplateListResponse = require('../models/template-list-response');
const ApiResponse = require('../models/api-response');
const dummyDataSet = require('../utils/dummy-data-set');
const pipes = require('../helpers/pipes');
const PdfGenerateAction = require('../models/pdf-generate-action');
const BaseService = require('../services/base-service');
const endpoints = require('../config/endpoints');
const utilFunctions = require('../utils/util-functions');
const baseUrls = require('../config/base-urls');
const {PDFDocument} = require('pdf-lib');

const preparePdf = async (data, isLandscape = false) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(data, {waitUntil: "networkidle0"});

    await page.evaluate(() => {
        return new Promise((resolve) => {
            if (typeof PagedPolyfill !== 'undefined') {
                const timeout = setTimeout(() => resolve(), 5000); // max wait 5s
                document.addEventListener("pagedjs:rendered", () => {
                    clearTimeout(timeout);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });


    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        landscape: isLandscape
    });

    await browser.close();
    return pdfBuffer;
}

exports.exportSecondaryOrderDetails = async (req, res) => {
    let secondaryOrder;
    let isSfa = false;
    let canExport = false;
    const permissions = req.permissions;
    const self = req.self;
    const orgId = self.orgId;
    let templateName = null;
    const cssPath = path.join(rootDir, 'public', 'css', 'table-template.css');
    const styles = fs.readFileSync(cssPath, 'utf8');

    const sellingPricePermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_SELLING_PRICE')[0];
    const tpNoDiscountPermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_TP_NO_DISCOUNT')[0];
    const tpDiscountPermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_TP_DISCOUNT')[0];

    const sellingPriceAuthorities = sellingPricePermission ? sellingPricePermission.authorities : [];
    const tpNoDiscountAuthorities = tpNoDiscountPermission ? tpNoDiscountPermission.authorities : [];
    const tpDiscountAuthorities = tpDiscountPermission ? tpDiscountPermission.authorities : [];


    canExport = sellingPriceAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_SELLING_PRICE_VIEW_ORDER').length > 0
        || tpNoDiscountAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_TP_NO_DISCOUNT_VIEW_ORDER').length > 0
        || tpDiscountAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_TP_DISCOUNT_VIEW_ORDER').length > 0;

    if (canExport === false) {
        const apiResponse = new ApiResponse.Error(['Access Denied'], 403);
        return res.status(403).json(apiResponse)
    }

    if (sellingPriceAuthorities.length > 0) {
        isSfa = sellingPriceAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_SELLING_PRICE_VIEW_ORDER').length > 0;
    }
    if (tpNoDiscountAuthorities.length > 0) {
        isSfa = tpNoDiscountAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_TP_NO_DISCOUNT_VIEW_ORDER').length > 0;
    }
    if (tpDiscountAuthorities.length > 0) {
        isSfa = tpDiscountAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_TP_DISCOUNT_VIEW_ORDER').length > 0;
    }

    try {
        secondaryOrder = await BaseService.getSecondaryOrderDetails(utilFunctions
            .prepareApiUrl(`${endpoints.secondary_order_details}/${req.params.orderId}`, baseUrls.sfa_url));

    } catch (error) {
        console.log(`Error from secondary order pdf export controller: ${error.message}`);
    }

    try {
        const data = await PdfGenerateAction.findOne({
            where: {
                action: 'secondary-order-details',
                organization_id: orgId
            }
        });
        if (!data) {
            return res.status(500).json(new ApiResponse.Error(['Template not found. Contact support'], 500));
        }
        templateName = data.dataValues.template_name;

    } catch (error) {
        console.log(`Error from secondary order pdf export controller: ${error.message}`);
    }

    try {
        const filePath = path.join(rootDir, 'templates', 'secondary-order-details', templateName);
        const content = await ejs.renderFile(filePath, {
            order: secondaryOrder,
            isSfa: isSfa,
            pipes: pipes,
            styles: styles
        });
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(content, {waitUntil: "networkidle0"});
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {top: "20mm", bottom: "20mm", left: "10mm", right: "10mm"},
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="table.pdf"',
            "Content-Length": pdfBuffer.length,
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.log(`Error from secondary order pdf export controller: ${error.message}`);
    }
}

exports.secondaryOrderSummaryForRtm = async (req, res) => {
    const imagePath = path.join(rootDir, 'public', 'logos', 'rtm.png');
    const imagePathForDetails = path.join(rootDir, 'public', 'logos', 'rtm-small.png');
    const base64 = fs.readFileSync(imagePath).toString('base64');
    const base64ForDetails = fs.readFileSync(imagePathForDetails).toString('base64');
    const orgLogo = `data:image/png;base64,${base64}`;
    const orgLogoForDetails = `data:image/png;base64,${base64ForDetails}`;
    const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'rtm-secondary-order-top-sheet.css');
    const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8');
    const cssPathForDetails = path.join(rootDir, 'public', 'css', 'rtm-secondary-order-details.css');
    const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8');

    try {
        const filePathForTopSheet = path.join(rootDir, 'rtm-templates', 'secondary-order-details', 'top-sheet.ejs');
        const filePathForDetails = path.join(rootDir, 'rtm-templates', 'secondary-order-details', 'order-details.ejs');

        const [contentOfTopSheet, contentOfOrderDetails] = await Promise.all([
            ejs.renderFile(filePathForTopSheet, {
                orgLogo: orgLogo,
                styles: stylesForTopSheet,
                products: dummyDataSet.porudcts
            }),
            ejs.renderFile(filePathForDetails, {
                orgLogo: orgLogoForDetails,
                styles: stylesForDetails,
                orders: dummyDataSet.orderSummary
            })
        ]);

        const [portraitPdf, landscapePdf, mergedPdf] = await Promise.all([
            preparePdf(contentOfTopSheet),
            preparePdf(contentOfOrderDetails, true),
            PDFDocument.create()
        ]);

        const [portraitDoc, landscapeDoc] = await Promise.all([
            PDFDocument.load(portraitPdf),
            PDFDocument.load(landscapePdf)
        ]);

        const [portraitPages, landscapePages] = await Promise.all([
            mergedPdf.copyPages(portraitDoc, portraitDoc.getPageIndices()),
            mergedPdf.copyPages(landscapeDoc, landscapeDoc.getPageIndices())
        ]);

        portraitPages.forEach((portraitPage) => mergedPdf.addPage(portraitPage));
        landscapePages.forEach((landscapePage) => mergedPdf.addPage(landscapePage));

        const finalPdf = await mergedPdf.save();
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${Date.now()}.pdf`,
            "Content-Length": finalPdf.length,
        });
        res.send(finalPdf);
    } catch (error) {
        res.status(500).json(new ApiResponse.Error(['Failed to generate pdf. Contact support']));
        console.log(`Error from secondary order pdf export controller: ${error.message}`);
    }
}