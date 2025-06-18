const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path')

const tableRows = [
    { product: "Uto Wash 450ml(UW1) ময়দা", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 },
    { product: "Uto Wash 450ml(UW1)", quantity: `10 + 1`, unitPrice: 325, price: 3250, vat: 0, discount: 0, amount: 3250 },
    { product: "Masti Fit 100gm(MF1)", quantity: `5`, unitPrice: 180, price: 900, vat: 0, discount: 0, amount: 900 },
    { product: "Tross AD3E 100ml(TA1)", quantity: `10 + 1`, unitPrice: 220, price: 2200, vat: 0, discount: 0, amount: 2200 }
];

const pages = [];

exports.pharmaInvoice = async (req, res) => {
    res.send(`<h1>This is page</h1>`)
    // try {
    //     for (let i = 0; i <= tableRows.length - 1; i = i + 20) {
    //         pages.push(tableRows.slice(i, i + 20));
    //     }
    //     const html = await ejs.renderFile(
    //         path.join(rootDir, "views", "pdf-template.ejs"),
    //         { pages }
    //     );
    //
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //
    //     try {
    //         await page.setContent(html, { waitUntil: "networkidle0" });
    //     } catch (e) {
    //         console.log(`Page error ${e}`);
    //     }
    //
    //     const pdfBuffer = await page.pdf({
    //         format: "A4",
    //         printBackground: true,
    //         margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    //     });
    //
    //     await browser.close();
    //
    //     res.set({
    //         "Content-Type": "application/pdf",
    //         "Content-Disposition": 'attachment; filename="table.pdf"',
    //         "Content-Length": pdfBuffer.length,
    //     });
    //     res.send(pdfBuffer);
    // } catch (error) {
    //     console.log(error);
    // }
}
