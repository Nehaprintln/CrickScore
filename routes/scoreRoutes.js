const express = require('express');
const { getMatchScore, updateScore } = require('../controllers/scroreController');
const router = express.Router();


router.get('/match', getMatchScore);
router.patch('/match', updateScore)

module.exports = router;
