const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);

// Admin routes (add authentication middleware later)
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
