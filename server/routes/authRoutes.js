const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateRoadplan } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/roadplan', protect, updateRoadplan);

module.exports = router;
