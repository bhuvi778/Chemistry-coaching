const AudioBook = require('../models/AudioBook');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getAudioBooks = async (req, res) => {
  try {
    const audioBooks = await AudioBook.find()
      .select('title description coverImage chapters category isActive')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(audioBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAudioBookById = async (req, res) => {
  try {
    const audioBook = await AudioBook.findById(req.params.id).lean();
    if (!audioBook) return res.status(404).json({ message: 'AudioBook not found' });
    res.json(audioBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAudioBook = async (req, res) => {
  try {
    const audioBook = new AudioBook(req.body);
    await audioBook.save();
    clearCache('audiobooks');
    res.json(audioBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'This audio file URL has already been added to the database',
        error: 'Duplicate audiobook'
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateAudioBook = async (req, res) => {
  try {
    const audioBook = await AudioBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!audioBook) return res.status(404).json({ message: 'AudioBook not found' });
    clearCache('audiobooks');
    clearCache('audiobook');
    res.json(audioBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAudioBook = async (req, res) => {
  try {
    await AudioBook.findByIdAndDelete(req.params.id);
    clearCache('audiobooks');
    res.json({ message: 'AudioBook deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAudioBooks, getAudioBookById, createAudioBook, updateAudioBook, deleteAudioBook, setClearCacheFunction };
