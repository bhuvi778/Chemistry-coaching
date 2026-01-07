const ExamCountdown = require('../models/ExamCountdown');

let clearCacheFunction = null;

const setClearCacheFunction = (fn) => {
    clearCacheFunction = fn;
};

// Get active exam countdown
const getActiveCountdown = async (req, res) => {
    try {
        // Get the most recent active countdown
        const countdown = await ExamCountdown.findOne({ isActive: true })
            .sort({ examDate: 1 }); // Get the nearest upcoming exam

        res.json(countdown);
    } catch (error) {
        console.error('Error fetching active countdown:', error);
        res.status(500).json({ message: 'Error fetching countdown' });
    }
};

// Get all countdowns (admin)
const getAllCountdowns = async (req, res) => {
    try {
        const countdowns = await ExamCountdown.find().sort({ examDate: 1 });
        res.json(countdowns);
    } catch (error) {
        console.error('Error fetching countdowns:', error);
        res.status(500).json({ message: 'Error fetching countdowns' });
    }
};

// Create countdown
const createCountdown = async (req, res) => {
    try {
        const countdown = new ExamCountdown(req.body);
        await countdown.save();

        if (clearCacheFunction) {
            clearCacheFunction('exam-countdown');
        }

        res.status(201).json(countdown);
    } catch (error) {
        console.error('Error creating countdown:', error);
        res.status(500).json({ message: 'Error creating countdown' });
    }
};

// Update countdown
const updateCountdown = async (req, res) => {
    try {
        const countdown = await ExamCountdown.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!countdown) {
            return res.status(404).json({ message: 'Countdown not found' });
        }

        if (clearCacheFunction) {
            clearCacheFunction('exam-countdown');
        }

        res.json(countdown);
    } catch (error) {
        console.error('Error updating countdown:', error);
        res.status(500).json({ message: 'Error updating countdown' });
    }
};

// Delete countdown
const deleteCountdown = async (req, res) => {
    try {
        const countdown = await ExamCountdown.findByIdAndDelete(req.params.id);

        if (!countdown) {
            return res.status(404).json({ message: 'Countdown not found' });
        }

        if (clearCacheFunction) {
            clearCacheFunction('exam-countdown');
        }

        res.json({ message: 'Countdown deleted successfully' });
    } catch (error) {
        console.error('Error deleting countdown:', error);
        res.status(500).json({ message: 'Error deleting countdown' });
    }
};

module.exports = {
    getActiveCountdown,
    getAllCountdowns,
    createCountdown,
    updateCountdown,
    deleteCountdown,
    setClearCacheFunction
};
