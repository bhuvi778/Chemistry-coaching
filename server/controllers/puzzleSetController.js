const PuzzleSet = require('../models/PuzzleSet');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getPuzzleSets = async (req, res) => {
  try {
    const puzzleSets = await PuzzleSet.find()
      .select('title description chapter category puzzles isActive')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(puzzleSets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPuzzleSet = async (req, res) => {
  try {
    const puzzleSet = new PuzzleSet(req.body);
    await puzzleSet.save();
    clearCache('puzzle-sets');
    res.json(puzzleSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePuzzleSet = async (req, res) => {
  try {
    const puzzleSet = await PuzzleSet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!puzzleSet) return res.status(404).json({ message: 'Puzzle Set not found' });
    clearCache('puzzle-sets');
    res.json(puzzleSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePuzzleSet = async (req, res) => {
  try {
    await PuzzleSet.findByIdAndDelete(req.params.id);
    clearCache('puzzle-sets');
    res.json({ message: 'Puzzle Set deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPuzzleSets, createPuzzleSet, updatePuzzleSet, deletePuzzleSet, setClearCacheFunction };
