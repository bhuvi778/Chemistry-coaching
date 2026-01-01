const Community = require('../models/Community');
const Feedback = require('../models/Feedback');

const getAllFeedback = async (req, res) => {
  try {
    // Get all community posts with feedbacks
    const posts = await Community.find({ 'feedbacks.0': { $exists: true } })
      .select('question answer feedbacks')
      .lean();

    // Flatten feedbacks from all posts
    const allFeedback = [];

    posts.forEach(post => {
      post.feedbacks.forEach(feedback => {
        allFeedback.push({
          _id: feedback._id,
          name: feedback.name,
          email: feedback.email,
          feedback: feedback.feedback,
          reactionType: feedback.reactionType,
          createdAt: feedback.createdAt,
          postId: post._id,
          postQuestion: post.question,
          postAnswer: post.answer
        });
      });
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
