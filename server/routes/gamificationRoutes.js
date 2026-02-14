const express = require('express');
const router = express.Router();
const { toggleLike, acceptResponse, getLeaderboard } = require('../controllers/gamificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/responses/:id/like', protect, toggleLike);
router.post('/responses/:id/accept', protect, acceptResponse);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
