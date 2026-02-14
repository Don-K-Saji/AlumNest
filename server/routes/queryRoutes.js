const express = require('express');
const router = express.Router();
const { createQuery, getQueries, getQueryById, addResponse, updateQueryStatus, editResponse, updateQuery, nudgeQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createQuery)
    .get(protect, getQueries);

router.route('/:id')
    .get(protect, getQueryById)
    .put(protect, updateQuery);

router.post('/:id/responses', protect, addResponse);
router.post('/:id/nudge', protect, nudgeQuery);
router.put('/responses/:responseId', protect, editResponse);
router.put('/:id/status', protect, updateQueryStatus);

module.exports = router;
