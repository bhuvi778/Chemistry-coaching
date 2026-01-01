const ScoreMatchBatch = require('../models/ScoreMatchBatch');

let clearCache = () => { };
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getScoreMatchBatches = async (req, res) => {
    try {
        const batches = await ScoreMatchBatch.find()
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createScoreMatchBatch = async (req, res) => {
    try {
        const batch = new ScoreMatchBatch(req.body);
        await batch.save();
        clearCache('scoreMatchBatches');
        res.json(batch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateScoreMatchBatch = async (req, res) => {
    try {
        const batch = await ScoreMatchBatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!batch) return res.status(404).json({ message: 'Score Max Batch not found' });
        clearCache('scoreMatchBatches');
        res.json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteScoreMatchBatch = async (req, res) => {
    try {
        const batch = await ScoreMatchBatch.findByIdAndDelete(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Score Max Batch not found' });
        clearCache('scoreMatchBatches');
        res.json({ message: 'Score Max Batch deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getScoreMatchBatches,
    createScoreMatchBatch,
    updateScoreMatchBatch,
    deleteScoreMatchBatch,
    setClearCacheFunction
};
