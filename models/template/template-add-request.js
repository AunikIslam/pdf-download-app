class TemplateAddRequest {
    constructor(request) {
        this.organization_id = request.body.organizationId;
        this.action = request.body.action;
        this.template_name = request.body.templateName;
    }
}

module.exports = TemplateAddRequest;