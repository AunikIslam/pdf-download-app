const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const pdfGenerateAction = require('../models/pdf-generate-action');
const fs = require('fs').promises;
const TemplateListResponse = require('../models/template-list-response');
const ApiResponse = require('../models/api-response');
const dummyDataSet = require('../utils/dummy-data-set');
const pipes = require('../helpers/pipes')

exports.getTemplates = async (req, res) => {
    try {
        const action = req.query.action;
        const organizationId = req.query.organizationId;

        if (!action || !organizationId) {
            res.status(400);
        }
        const dirPath = path.join(rootDir, 'templates', action);

        const [templateFiles, fileNames] = await Promise.all([
            pdfGenerateAction.findAll({
                where: {
                    organization_id: organizationId,
                    action: action
                }
            }),
            fs.readdir(dirPath)
        ]);

        const templateFile = templateFiles.length > 0 ? templateFiles[0] : null;
        const files = await Promise.all(
            fileNames.map(async (name) => {
                const fullPath = path.join(dirPath, name);
                const content = await ejs.renderFile(fullPath, {
                    order: dummyDataSet.secondaryOrderDummyData,
                    pipes: pipes,
                    showPercentage: false
                });
                return {
                    isSelected: false,
                    fileName: name,
                    fileContent: content,
                }
            })
        );

        if (templateFile) {
            files.forEach((file) => {
                if (templateFile.template_name.includes(file.fileName)) {
                    file.isSelected = true;
                }
            });
        }

        const listResponse = new TemplateListResponse(templateFile ? templateFile.id : null, files);
        const pageInfo = {
            size: 20,
            number: 0,
            totalElements: files.length,
            totalPages: Math.ceil(files.length / 20)
        };
        const apiResponse = new ApiResponse(listResponse, pageInfo);
        res.status(200).json(apiResponse);


    } catch (error) {
        console.log(error.message);
    }

}

exports.setTemplates = async (req, res) => {

}