const ChemSnap = require('../models/ChemSnap');

let clearCacheFunction = null;

const setClearCacheFunction = (fn) => {
    clearCacheFunction = fn;
};

// Get all ChemSnaps
const getAllChemSnaps = async (req, res) => {
    try {
        const chemSnaps = await ChemSnap.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(chemSnaps);
    } catch (error) {
        console.error('Error fetching ChemSnaps:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single ChemSnap by ID
const getChemSnapById = async (req, res) => {
    try {
        const chemSnap = await ChemSnap.findById(req.params.id);
        if (!chemSnap) {
            return res.status(404).json({ message: 'ChemSnap not found' });
        }
        res.json(chemSnap);
    } catch (error) {
        console.error('Error fetching ChemSnap:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new ChemSnap (Admin)
const createChemSnap = async (req, res) => {
    try {
        const chemSnap = new ChemSnap(req.body);
        await chemSnap.save();

        if (clearCacheFunction) {
            clearCacheFunction('chemsnaps');
        }

        res.status(201).json(chemSnap);
    } catch (error) {
        console.error('Error creating ChemSnap:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update ChemSnap (Admin)
const updateChemSnap = async (req, res) => {
    try {
        const chemSnap = await ChemSnap.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!chemSnap) {
            return res.status(404).json({ message: 'ChemSnap not found' });
        }

        if (clearCacheFunction) {
            clearCacheFunction('chemsnaps');
        }

        res.json(chemSnap);
    } catch (error) {
        console.error('Error updating ChemSnap:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete ChemSnap (Admin)
const deleteChemSnap = async (req, res) => {
    try {
        const chemSnap = await ChemSnap.findByIdAndDelete(req.params.id);

        if (!chemSnap) {
            return res.status(404).json({ message: 'ChemSnap not found' });
        }

        if (clearCacheFunction) {
            clearCacheFunction('chemsnaps');
        }

        res.json({ message: 'ChemSnap deleted successfully' });
    } catch (error) {
        console.error('Error deleting ChemSnap:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    setClearCacheFunction,
    getAllChemSnaps,
    getChemSnapById,
    createChemSnap,
    updateChemSnap,
    deleteChemSnap
};
