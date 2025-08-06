const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const fs = require('fs');
const ApiResponse = require('../models/api-response');
const dummyDataSet = require('../utils/dummy-data-set');
const PdfGenerateAction = require('../models/pdf-generate-action');
const BaseService = require('../services/base-service');
const endpoints = require('../config/endpoints');
const utilFunctions = require('../utils/util-functions');
const baseUrls = require('../config/base-urls');
const {PDFDocument} = require('pdf-lib');
const { chromium } = require('playwright');
const marketFilterImplementation = require('../repositories/market/impl/market-filter-implementation');

const preparePdf = async (data, context, isLandscape = false) => {
    const page = await context.newPage();
    await page.setContent(data, { waitUntil: "load" });
    await page.evaluate(() => {
        return new Promise((resolve) => {
            if (typeof PagedPolyfill !== 'undefined') {
                let resolved = false;
                const timeout = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, 1000);
                document.addEventListener("pagedjs:rendered", () => {
                    if (!resolved) {
                        clearTimeout(timeout);
                        resolved = true;
                        resolve();
                    }
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
    await page.close();
    return pdfBuffer;
}

exports.exportSecondaryOrderDetails = async (req, res) => {
    let isSfa = false;
    const permissions = req.permissions;
    const self = req.self;
    const orgId = self.orgId;
    const cssPath = path.join(rootDir, 'public', 'css', 'table-template.css');
    const styles = fs.readFileSync(cssPath, 'utf8');
    const imagePath = path.join(rootDir, 'public', 'logos', `${self.orgCode}.png`);
    const base64 = fs.readFileSync(imagePath).toString('base64');
    const orgLogo = `data:image/png;base64,${base64}`;

    const sellingPricePermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_SELLING_PRICE')[0];
    const tpNoDiscountPermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_TP_NO_DISCOUNT')[0];
    const tpDiscountPermission = permissions.filter(permission => permission.name === 'SECONDARY_ORDER_TP_DISCOUNT')[0];

    const sellingPriceAuthorities = sellingPricePermission ? sellingPricePermission.authorities : [];
    const tpNoDiscountAuthorities = tpNoDiscountPermission ? tpNoDiscountPermission.authorities : [];
    const tpDiscountAuthorities = tpDiscountPermission ? tpDiscountPermission.authorities : [];


    const canExport = sellingPriceAuthorities.filter(authority => authority.name === 'SECONDARY_ORDER_SELLING_PRICE_VIEW_ORDER').length > 0
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
        const secondaryOrder = await BaseService.getSecondaryOrderDetails(utilFunctions
            .prepareApiUrl(`${endpoints.secondary_order_details}/${req.params.orderId}`, baseUrls.sfa_url))
            .catch(error => {
                throw new Error(`Failed while fetching order details. Contact Support`)
            });

        const data = await PdfGenerateAction.findOne({
            where: {
                action: 'secondary-order-details',
                organization_id: orgId
            }
        })
            .catch(error => {
                throw new Error(`Failed while template. Contact Support`);
            });

        if (!data) {
            return res.status(500).json(new ApiResponse.Error(['Template not found. Contact support'], 500));
        }

        const templateName = data.dataValues.template_name;

        const filePath = path.join(rootDir, 'templates', 'secondary-order-details', templateName);

        const content = await ejs.renderFile(filePath, {
            order: secondaryOrder,
            orgLogo,
            isSfa,
            utilFunctions,
            styles
        })
            .catch(error => {
                throw new Error(`Failed while rendering template. Contact Support`);
            })

        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();

        const finalPdf = await preparePdf(content, context).catch(error => {
            throw new Error(`Failed while preparing pdf. Contact Support`);
        });

        await browser.close().catch(error => {
            throw new Error(`Failed while closing browser. Contact Support`);
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${Date.now()}.pdf"`,
            "Content-Length": finalPdf.length,
        });
        res.send(finalPdf);

    } catch (error) {
        console.error(`Error from secondary order pdf export controller: ${error.message}`);
        return res.status(500).json(new ApiResponse.Error(['Failed to generate pdf. Contact support']));
    }
}

exports.secondaryOrderSummaryForRtm = async (req, res) => {
    const imagePath = path.join(rootDir, 'public', 'logos', 'rtm.png');
    const imagePathForDetails = path.join(rootDir, 'public', 'logos', 'rtm-small.png');
    const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'rtm-secondary-order-top-sheet.css');
    const cssPathForDetails = path.join(rootDir, 'public', 'css', 'rtm-secondary-order-details.css');

    const base64 = fs.readFileSync(imagePath).toString('base64');
    const base64ForDetails = fs.readFileSync(imagePathForDetails).toString('base64');
    const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8');
    const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8');

    const orgLogo = `data:image/png;base64,${base64}`;
    const orgLogoForDetails = `data:image/png;base64,${base64ForDetails}`;


    try {
        const filePathForTopSheet = path.join(rootDir, 'rtm-templates', 'secondary-order-details', 'top-sheet.ejs');
        const filePathForDetails = path.join(rootDir, 'rtm-templates', 'secondary-order-details', 'order-details.ejs');

        const [contentOfTopSheet, contentOfOrderDetails] = await Promise.all([
            ejs.renderFile(filePathForTopSheet, {
                orgLogo: orgLogo,
                styles: stylesForTopSheet,
                products: dummyDataSet.porudcts,
                utilFunctions
            }),
            ejs.renderFile(filePathForDetails, {
                orgLogo: orgLogoForDetails,
                styles: stylesForDetails,
                orders: dummyDataSet.orderSummary,
                utilFunctions
            })
        ])
            .catch((error) => {
                throw new Error(`Failed while rendering template. Contact Support`);
            });

        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();

        const [portraitPdf, landscapePdf, mergedPdf] = await Promise.all([
            preparePdf(contentOfTopSheet, context),
            preparePdf(contentOfOrderDetails, context, true),
            PDFDocument.create()
        ])
            .catch((error) => {
                throw new Error(`Failed while preparing pdf. Contact Support`);
            });

        await browser.close().catch(error => {
            throw new Error(`Failed while closing browser. Contact Support`);
        });

        const [portraitDoc, landscapeDoc] = await Promise.all([
            PDFDocument.load(portraitPdf),
            PDFDocument.load(landscapePdf)
        ]).catch(error => {
            throw new Error(`Failed while loading doc. Contact Support.`);
        });

        const [portraitPages, landscapePages] = await Promise.all([
            mergedPdf.copyPages(portraitDoc, portraitDoc.getPageIndices()),
            mergedPdf.copyPages(landscapeDoc, landscapeDoc.getPageIndices())
        ]).catch(error => {
            throw new Error(`Failed while copying pages. Contact Support.`);
        });

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
        res.status(500).json(new ApiResponse.Error([error.message]));
    }
}

exports.getUserMarketIds = async (req, res) => {
    const organizationId = req.query.organizationId;
    const userId = req.query.userId;
    console.log(req.query)
    const marketIds = await marketFilterImplementation.getAccessibleMarketIds({
        organizationId: organizationId,
        userId: userId,
        hasMarketLevel: true,
        activeOnly: true
    });
    console.log(marketIds);
    return res.status(200).json({
        id: 1,
        name: 'Actual Name',
        email: 'user@realdomain.com',
        createdAt: new Date().toISOString()
    });
}