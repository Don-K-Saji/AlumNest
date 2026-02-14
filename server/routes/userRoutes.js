const express = require('express');
const router = express.Router();
const { getAlumni, getUserById, updateUserProfile, createUser, updateUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/alumni', protect, getAlumni);
router.get('/:id', protect, getUserById);
router.post('/', protect, createUser); // Should ideally add 'admin' middleware here
router.put('/profile', protect, updateUserProfile);
router.put('/:id', protect, adminOnly, updateUser);

module.exports = router;
