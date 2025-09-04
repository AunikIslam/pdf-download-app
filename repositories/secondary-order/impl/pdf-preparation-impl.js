const ejs = require('ejs');
const path = require('path');
const rootDir = require('../../../utils/path');
const fs = require('fs');
const {PDFDocument} = require('pdf-lib');
const { chromium } = require('playwright');
const utilFunctions = require("../../../utils/util-functions");
const ApiResponse = require("../../../models/api-response");
const browserPool = require('../../../config/browser-pool');

class PdfPreparationImpl {

    static async preparePdf(data, context, isLandscape = false) {
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

    static async prepareSecondaryOrderPdfForAfm(topSheetContent, detailContent) {
        const imagePath = path.join(rootDir, 'public', 'logos', 'rtm.png');
        const imagePathForDetails = path.join(rootDir, 'public', 'logos', 'rtm-small.png');
        const fontPath = path.join(rootDir, 'public', 'css', 'font-styles.css');
        const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'afm', 'afm-secondary-order-top-sheet.css');
        const cssPathForDetails = path.join(rootDir, 'public', 'css', 'afm', 'afm-secondary-order-details.css');

        const base64 = fs.readFileSync(imagePath).toString('base64');
        const base64ForDetails = fs.readFileSync(imagePathForDetails).toString('base64');
        const stylesForFonts = fs.readFileSync(fontPath, 'utf8');
        const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8') + `\n` + stylesForFonts;
        const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8') + `\n` + stylesForFonts;

        const orgLogo = `data:image/png;base64,${base64}`;
        const orgLogoForDetails = `data:image/png;base64,${base64ForDetails}`;

        try {
            const filePathForTopSheet = path.join(rootDir, 'templates', 'afm-templates', 'secondary-order', 'top-sheet.ejs');
            const filePathForDetails = path.join(rootDir, 'templates', 'afm-templates', 'secondary-order', 'order-details.ejs');

            const [contentOfTopSheet, orderDetailsContent] = await Promise.all([
                ejs.renderFile(filePathForTopSheet, {
                    orgLogo: orgLogo,
                    styles: stylesForTopSheet,
                    items: topSheetContent,
                    utilFunctions
                }),
                ejs.renderFile(filePathForDetails, {
                    orgLogo: orgLogo,
                    styles: stylesForDetails,
                    items: detailContent
                })
            ])
                .catch((error) => {
                    console.log(error.message);
                    throw new Error(`Failed while rendering template. Contact Support`);
                });

            const browser = await browserPool.getBrowser();
            const context = await browser.newContext();

            const [topSheetPdf, detailsPdf, mergedPdf] = await Promise.all([
                this.preparePdf(contentOfTopSheet, context),
                this.preparePdf(orderDetailsContent, context),
                PDFDocument.create()
            ])
                .catch((error) => {
                    throw new Error(`Failed while preparing pdf. Contact Support`);
                });

            const [topSheetDoc, detailsDoc] = await Promise.all([
                PDFDocument.load(topSheetPdf),
                PDFDocument.load(detailsPdf)
            ]).catch(error => {
                throw new Error(`Failed while loading doc. Contact Support.`);
            });

            const [topSheetPages, detailsPages] = await Promise.all([
                mergedPdf.copyPages(topSheetDoc, topSheetDoc.getPageIndices()),
                mergedPdf.copyPages(detailsDoc, detailsDoc.getPageIndices())
            ]).catch(error => {
                throw new Error(`Failed while copying pages. Contact Support.`);
            });

            topSheetPages.forEach((portraitPage) => mergedPdf.addPage(portraitPage));
            detailsPages.forEach((landscapePage) => mergedPdf.addPage(landscapePage));

            return await mergedPdf.save();
        }
        catch (error) {
            console.log(`Error from pdf generation: ${error.message}`)
        }
    }
}

module.exports = PdfPreparationImpl;