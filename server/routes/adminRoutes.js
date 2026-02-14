const express = require('express');
const router = express.Router();
const { getAllUsers, verifyUser, deleteUser, sendAdminNotification } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/users')
    .get(protect, adminOnly, getAllUsers);

router.route('/users/:id/verify')
    .put(protect, adminOnly, verifyUser);

router.route('/users/:id')
    .delete(protect, adminOnly, deleteUser);

router.route('/notifications')
    .post(protect, adminOnly, sendAdminNotification);

module.exports = router;
