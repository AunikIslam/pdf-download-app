const { chromium } = require('playwright');
let browser;

exports.launchBrowser = async () => {
    browser = await chromium.launch({ headless: true });
    console.log(`Launch browser`);
    return browser;
}

exports.getBrowser = async () => {
    console.log(`Get previously launched browser`);
    return browser;
};
