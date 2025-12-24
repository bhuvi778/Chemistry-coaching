const Magazine = require('../models/Magazine');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find()
      .select('title description coverImage year month topics isActive')
      .sort({ year: -1, month: -1 })
      .lean()
      .exec();
    res.json(magazines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMagazine = async (req, res) => {
  try {
    const magazine = new Magazine(req.body);
    await magazine.save();
    clearCache('magazines');
    res.json(magazine);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'This magazine PDF URL has already been added to the database',
        error: 'Duplicate magazine'
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!magazine) return res.status(404).json({ message: 'Magazine not found' });
    clearCache('magazines');
    res.json(magazine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMagazine = async (req, res) => {
  try {
    await Magazine.findByIdAndDelete(req.params.id);
    clearCache('magazines');
    res.json({ message: 'Magazine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMagazines, createMagazine, updateMagazine, deleteMagazine, setClearCacheFunction };
