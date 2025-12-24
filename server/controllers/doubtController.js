const Doubt = require('../models/Doubt');

const getPublishedDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 }).lean();
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDoubt = async (req, res) => {
  try {
    const doubt = new Doubt({
      ...req.body,
      isPublished: false,
      reactions: {
        helpful: 0,
        insightful: 0,
        thanks: 0
      }
    });
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDoubt = async (req, res) => {
  try {
    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doubt deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReaction = async (req, res) => {
  try {
    const { reactionType } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    
    if (reactionType === 'helpful') doubt.reactions.helpful += 1;
    else if (reactionType === 'insightful') doubt.reactions.insightful += 1;
    else if (reactionType === 'thanks') doubt.reactions.thanks += 1;
    else return res.status(400).json({ message: 'Invalid reaction type' });
    
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPublishedDoubts, getDoubts, createDoubt, updateDoubt, deleteDoubt, addReaction };
