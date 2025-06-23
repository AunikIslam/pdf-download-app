const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template-controller');

router.get('/template-list', templateController.getTemplates);

router.get('/set-template', templateController.setTemplates);

module.exports = router;