const Feedback = require('../models/Feedback');

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedback);
  } catch (error) {
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
