const { chromium } = require('playwright');
let browser;

exports.launchBrowser = async () => {
    browser = await chromium.launch({ headless: true });
    return browser;
}

exports.getBrowser = async () => {
    return browser;
};
