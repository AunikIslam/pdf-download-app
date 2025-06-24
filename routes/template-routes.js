const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template-controller');

router.get('/template-list', templateController.getTemplates);

router.post('/add-template', templateController.addTemplate);

router.patch('/edit-template/:id', templateController.editTemplate);

module.exports = router;