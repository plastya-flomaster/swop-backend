const express = require('express');
const router = express.Router();

const categories = require('../../controllers/categories.controller');
// api/categories
router.get('/', categories.getAllCategories);

module.exports = router;
