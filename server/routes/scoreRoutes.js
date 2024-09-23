const express = require('express');
// const { getCurrentScore, updateScore } = require('../controllers/scroreController');
const { getMatchScore, updateScore } = require('../controllers/scroreController');
const router = express.Router();

// router.get('/', getCurrentScore);
// router.post('/update', updateScore);
// router.get('/match', getMatchScore);
// router.patch('/match', updateScore)

router.get('/match', getMatchScore);
router.patch('/match', updateScore)

module.exports = router;
