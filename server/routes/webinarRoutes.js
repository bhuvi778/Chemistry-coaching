const express = require('express');
const router = express.Router();
const { getWebinarCards, createWebinarCard, updateWebinarCard, deleteWebinarCard } = require('../controllers/webinarController');

router.get('/', getWebinarCards);
router.post('/', createWebinarCard);
router.put('/:id', updateWebinarCard);
router.delete('/:id', deleteWebinarCard);

module.exports = router;
