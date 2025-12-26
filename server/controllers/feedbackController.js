const Feedback = require('../models/Feedback');
const Doubt = require('../models/Doubt');

const getFeedback = async (req, res) => {
  try {
    // Get all doubts with feedbacks
    const doubts = await Doubt.find({ 'feedbacks.0': { $exists: true } })
      .select('question feedbacks')
      .sort({ createdAt: -1 })
      .lean();
    
    // Flatten feedbacks from all doubts
    const allFeedback = [];
    doubts.forEach(doubt => {
      if (doubt.feedbacks && doubt.feedbacks.length > 0) {
        doubt.feedbacks.forEach(fb => {
          allFeedback.push({
            ...fb,
            doubtId: doubt._id,
            question: doubt.question
          });
        });
      }
    });
    
    // Sort by date
    allFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeedback, createFeedback, deleteFeedback };
