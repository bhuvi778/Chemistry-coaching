const express = require('express');
const router = express.Router();
const { getPublishedCommunity, getCommunity, createCommunityPost, updateCommunityPost, deleteCommunityPost, addReaction } = require('../controllers/communityController');

router.get('/published', getPublishedCommunity);
router.get('/', getCommunity);
router.post('/', createCommunityPost);
router.put('/:id', updateCommunityPost);
router.delete('/:id', deleteCommunityPost);
router.post('/:id/reaction', addReaction);

module.exports = router;
