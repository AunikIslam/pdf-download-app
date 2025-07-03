const ejs = require('ejs');
const path = require('path');
const rootDir = require('../utils/path');
const pdfGenerateAction = require('../models/pdf-generate-action');
const fs = require('fs').promises;
const TemplateListResponse = require('../models/template-list-response');
const ApiResponse = require('../models/api-response');
const dummyDataSet = require('../utils/dummy-data-set');
const utilFunctions = require('../utils/util-functions');
const PdfGenerateAction = require('../models/pdf-generate-action');
const TemplateAddRequest = require('../models/template-add-request');

exports.getTemplates = async (req, res) => {
    try {
        const action = req.query.action;
        const organizationId = req.query.organizationId;

        if (!action) {
            return res.status(400).json(new ApiResponse.Error(['Action is required.'], 400));
        }
        if (!organizationId) {
            return res.status(400).json(new ApiResponse.Error(['Organization Id is required.'], 400));
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
        ])
            .catch(error => {
                throw new Error(`Error while database retrieve: ${error.message}`)
            });

        const templateFile = templateFiles.length > 0 ? templateFiles[0] : null;
        const files = await Promise.all(
            fileNames.map(async (name) => {
                const fullPath = path.join(dirPath, name);
                const content = await ejs.renderFile(fullPath, {
                    order: dummyDataSet.secondaryOrderDummyData,
                    utilFunctions,
                    isSfa: true,
                    styles: '',
                    orgLogo: null
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
        const apiResponse = new ApiResponse.Success(listResponse, pageInfo);
        res.status(200).json(apiResponse);
    } catch (error) {
        console.log(`Error from template list api: ${error.message}`);
    }
}

exports.addTemplate = async (req, res) => {
    const errorMessages = [];

    if (req.body.organizationId == null) {
        errorMessages.push('Organization id is required');
    }
    if (req.body.action == null) {
        errorMessages.push('Action is required');
    }
    if (req.body.templateName == null) {
        errorMessages.push('Template is required');
    }
    if (errorMessages.length > 0) {
        return res.status(400).json(new ApiResponse.Error(errorMessages, 400));
    }
    const template = await PdfGenerateAction.create(new TemplateAddRequest(req));
    const apiResponse = new ApiResponse.Success(template.id);
    return res.status(200).json(apiResponse);
}

exports.editTemplate = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const errorMessages = [];
    if (id == null) {
        errorMessages.push('Template id is required.');
    }
    if (errorMessages.length > 0) {
        const apiResponse = new ApiResponse.Error(errorMessages, 400);
        return res.status(400).json(apiResponse);
    }
    try {
        await PdfGenerateAction.update(body, {
            where: {
                id: id
            }
        });
        const apiResponse = new ApiResponse.Success(req.params.id);
        return res.status(200).json(apiResponse);
    } catch (error) {

    }

}