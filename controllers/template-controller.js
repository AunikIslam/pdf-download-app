const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const pdfGenerateAction = require('../models/pdf-generate-action');
const fs = require('fs').promises;

exports.getTemplates = async (req, res) => {
    try {
        const action = req.query.action;
        const organizationId = req.query.organizationId;

        if (!action || !organizationId) {
            res.status(400);
        }
        const dirPath = path.join(rootDir, 'templates', action);

        const [templateFile, files] = await Promise.all([
            pdfGenerateAction.findAll({
                where: {
                    organization_id: organizationId,
                    action: action
                }
            }),
            fs.readdir(dirPath)
        ])

        console.log(templateFile);
        console.log(files);
    } catch (error) {
        console.log(error);
    }

}