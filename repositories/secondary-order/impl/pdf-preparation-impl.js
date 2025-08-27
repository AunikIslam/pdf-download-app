const ejs = require('ejs');
const path = require('path');
const rootDir = require('../../../utils/path');
const fs = require('fs');
const {PDFDocument} = require('pdf-lib');
const { chromium } = require('playwright');
const dummyDataSet = require("../../../utils/dummy-data-set");
const utilFunctions = require("../../../utils/util-functions");
const ApiResponse = require("../../../models/api-response");

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

    static async prepareSecondaryOrderPdfForAfm(topSheetContent) {
        const imagePath = path.join(rootDir, 'public', 'logos', 'rtm.png');
        const imagePathForDetails = path.join(rootDir, 'public', 'logos', 'rtm-small.png');
        const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'afm-secondary-order-top-sheet.css');
        // const cssPathForDetails = path.join(rootDir, 'public', 'css', 'rtm-product-details.css');

        const base64 = fs.readFileSync(imagePath).toString('base64');
        const base64ForDetails = fs.readFileSync(imagePathForDetails).toString('base64');
        const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8');
        // const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8');

        const orgLogo = `data:image/png;base64,${base64}`;
        const orgLogoForDetails = `data:image/png;base64,${base64ForDetails}`;

        try {
            const filePathForTopSheet = path.join(rootDir, 'templates', 'afm-templates', 'secondary-order', 'top-sheet.ejs');
            const [contentOfTopSheet, contentOfOrderDetails] = await Promise.all([
                ejs.renderFile(filePathForTopSheet, {
                    orgLogo: orgLogo,
                    styles: stylesForTopSheet,
                    items: topSheetContent,
                    utilFunctions
                })
            ])
                .catch((error) => {
                    throw new Error(`Failed while rendering template. Contact Support`);
                });

            const browser = await chromium.launch({ headless: true });
            const context = await browser.newContext();

            const [portraitPdf, mergedPdf] = await Promise.all([
                this.preparePdf(contentOfTopSheet, context),
                // preparePdf(contentOfOrderDetails, context, true),
                PDFDocument.create()
            ])
                .catch((error) => {
                    throw new Error(`Failed while preparing pdf. Contact Support`);
                });

            await browser.close().catch(error => {
                throw new Error(`Failed while closing browser. Contact Support`);
            });

            const [portraitDoc] = await Promise.all([
                PDFDocument.load(portraitPdf),
                // PDFDocument.load(landscapePdf)
            ]).catch(error => {
                throw new Error(`Failed while loading doc. Contact Support.`);
            });

            const [portraitPages] = await Promise.all([
                mergedPdf.copyPages(portraitDoc, portraitDoc.getPageIndices()),
                // mergedPdf.copyPages(landscapeDoc, landscapeDoc.getPageIndices())
            ]).catch(error => {
                throw new Error(`Failed while copying pages. Contact Support.`);
            });

            portraitPages.forEach((portraitPage) => mergedPdf.addPage(portraitPage));
            // landscapePages.forEach((landscapePage) => mergedPdf.addPage(landscapePage));

            return await mergedPdf.save();
        }
        catch (error) {

        }
    }
}

module.exports = PdfPreparationImpl;