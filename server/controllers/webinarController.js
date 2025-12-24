const WebinarCard = require('../models/WebinarCard');

const getWebinarCards = async (req, res) => {
  try {
    const cards = await WebinarCard.find().sort({ createdAt: -1 }).lean();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWebinarCard = async (req, res) => {
  try {
    const card = new WebinarCard(req.body);
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWebinarCard = async (req, res) => {
  try {
    const card = await WebinarCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ message: 'Webinar Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWebinarCard = async (req, res) => {
  try {
    await WebinarCard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Webinar Card deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWebinarCards, createWebinarCard, updateWebinarCard, deleteWebinarCard };
