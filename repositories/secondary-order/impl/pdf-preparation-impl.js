const ejs = require('ejs');
const path = require('path');
const rootDir = require('../../../utils/path');
const fs = require('fs');
const {PDFDocument} = require('pdf-lib');
const { chromium } = require('playwright');

class PdfPreparationImpl {

    static prepareSecondaryOrderPdfForAfm() {
        const imagePath = path.join(rootDir, 'public', 'logos', 'rtm.png');
        const imagePathForDetails = path.join(rootDir, 'public', 'logos', 'rtm-small.png');
        const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'rtm-product-top-sheet.css');
        const cssPathForDetails = path.join(rootDir, 'public', 'css', 'rtm-product-details.css');

        const base64 = fs.readFileSync(imagePath).toString('base64');
        const base64ForDetails = fs.readFileSync(imagePathForDetails).toString('base64');
        const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8');
        const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8');

        const orgLogo = `data:image/png;base64,${base64}`;
        const orgLogoForDetails = `data:image/png;base64,${base64ForDetails}`;
    }
}