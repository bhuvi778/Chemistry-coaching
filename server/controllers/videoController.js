const Video = require('../models/Video');

// Clear cache helper (will be injected from server.js)
let clearCache = () => { };

const setClearCacheFunction = (fn) => {
  clearCache = fn;
};

// @desc    Get all active videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    // Check if admin wants all videos (including inactive)
    const showAll = req.query.all === 'true';

    const filter = showAll ? {} : { isActive: true };

    const videos = await Video.find(filter)
      .select('title description category examType youtubeId instructor duration isActive createdAt views classNotes.filename classNotes.uploadedAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new video
// @route   POST /api/videos
// @access  Private (Admin)
const createVideo = async (req, res) => {
  try {
    console.log('=== RECEIVED VIDEO POST REQUEST ===');
    console.log('Request body:', req.body);
    console.log('YouTube ID received:', req.body.youtubeId);

    const video = new Video(req.body);
    await video.save();

    console.log('Video saved successfully:', video._id);
    console.log('Saved YouTube ID:', video.youtubeId);
    console.log('===================================');

    // Clear cache so new video shows immediately
    clearCache('videos');

    res.json(video);
  } catch (error) {
    console.error('Error saving video:', error.message);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'This YouTube video has already been added to the database',
        error: 'Duplicate video'
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private (Admin)
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Clear cache so updated video shows immediately
    clearCache('videos');
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (Admin)
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Clear cache so deletion reflects immediately
    clearCache('videos');
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  setClearCacheFunction
};
