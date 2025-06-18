const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template-controller');

router.get('/api/pdf-generation/template-list', templateController.getTemplates);

module.exports = router;