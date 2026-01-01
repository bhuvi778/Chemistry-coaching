const Community = require('../models/Community');
const Feedback = require('../models/Feedback');

const getPublishedCommunity = async (req, res) => {
  try {
    const posts = await Community.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommunity = async (req, res) => {
  try {
    const posts = await Community.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCommunityPost = async (req, res) => {
  try {
    const post = new Community({
      ...req.body,
      isPublished: false,
      reactions: {
        helpful: 0,
        insightful: 0,
        thanks: 0
      }
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCommunityPost = async (req, res) => {
  try {
    const post = await Community.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Community post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCommunityPost = async (req, res) => {
  try {
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: 'Community post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReaction = async (req, res) => {
  try {
    const { reactionType, name, email, feedback } = req.body;
    const post = await Community.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Community post not found' });

    // Handle like/dislike with feedback
    if (reactionType === 'like' || reactionType === 'dislike') {
      // Increment like or dislike count
      if (reactionType === 'like') {
        post.likes = (post.likes || 0) + 1;
      } else {
        post.dislikes = (post.dislikes || 0) + 1;
      }

      // Add feedback entry if name is provided
      if (name) {
        if (!post.feedbacks) post.feedbacks = [];
        post.feedbacks.push({
          name,
          email: email || '',
          feedback: feedback || '',
          reactionType,
          createdAt: new Date()
        });
      }

      await post.save();
      return res.json({ message: 'Reaction submitted successfully', post });
    }

    // Handle simple reactions (helpful/insightful/thanks)
    if (reactionType === 'helpful') post.reactions.helpful += 1;
    else if (reactionType === 'insightful') post.reactions.insightful += 1;
    else if (reactionType === 'thanks') post.reactions.thanks += 1;
    else return res.status(400).json({ message: 'Invalid reaction type' });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPublishedCommunity, getCommunity, createCommunityPost, updateCommunityPost, deleteCommunityPost, addReaction };
