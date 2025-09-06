const path = require('path');
const rootDir = require('../utils/path');
const fs = require('fs');

exports.getAfmStaticProperties = () => {
    const imagePath = path.join(rootDir, 'public', 'logos', 'afm.png');
    const cssPathForTopSheet = path.join(rootDir, 'public', 'css', 'afm', 'afm-secondary-order-top-sheet.css');
    const cssPathForDetails = path.join(rootDir, 'public', 'css', 'afm', 'afm-secondary-order-details.css');

    const base64 = fs.readFileSync(imagePath).toString('base64');
    const stylesForTopSheet = fs.readFileSync(cssPathForTopSheet, 'utf8');
    const stylesForDetails = fs.readFileSync(cssPathForDetails, 'utf8');

    const orgLogo = `data:image/png;base64,${base64}`;

    return {orgLogo, stylesForTopSheet, stylesForDetails}

}