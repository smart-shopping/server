const express = require('express');
const router  = express.Router();
const { getMusicAll, getMusicByMood } = require('../controllers/music')

router.get('/', getMusicAll)
router.post('/', getMusicByMood)

module.exports = router;
