const express = require('express');
const router = express.Router();
const { translateText, getHistory, getStats, toggleFavorite, deleteTranslation } = require('../controllers/translationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, getStats);
router.route('/').post(protect, translateText).get(protect, getHistory);
router.route('/:id').delete(protect, deleteTranslation);
router.route('/:id/favorite').put(protect, toggleFavorite);

module.exports = router;
