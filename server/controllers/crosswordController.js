const Crossword = require('../models/Crossword');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getCrosswords = async (req, res) => {
  try {
    const crosswords = await Crossword.find()
      .select('title description chapter category difficulty grid isActive')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(crosswords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCrosswordById = async (req, res) => {
  try {
    const crossword = await Crossword.findById(req.params.id).lean();
    if (!crossword) return res.status(404).json({ message: 'Crossword not found' });
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCrossword = async (req, res) => {
  try {
    const crossword = new Crossword(req.body);
    await crossword.save();
    clearCache('crosswords');
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCrossword = async (req, res) => {
  try {
    const crossword = await Crossword.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crossword) return res.status(404).json({ message: 'Crossword not found' });
    clearCache('crosswords');
    clearCache('crossword');
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCrossword = async (req, res) => {
  try {
    await Crossword.findByIdAndDelete(req.params.id);
    clearCache('crosswords');
    res.json({ message: 'Crossword deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCrosswords, getCrosswordById, createCrossword, updateCrossword, deleteCrossword, setClearCacheFunction };
