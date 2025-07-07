const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');


router.post('/api/ai/get-review', aiController.getReview);

module.exports = router