const StudyMaterial = require('../models/StudyMaterial');
const mongoose = require('mongoose');

let clearCache = () => { };
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find()
      .select('title description category fileUrl fileType examType thumbnailUrl fileSize isActive createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudyMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).lean();
    if (!material) return res.status(404).json({ message: 'Study Material not found' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudyMaterial = async (req, res) => {
  try {
    console.log('[Study Material] ========== NEW CREATE REQUEST ==========');
    console.log('[Study Material] Full request body:', JSON.stringify(req.body, null, 2));
    console.log('[Study Material] Mongoose connection state:', mongoose.connection.readyState);
    
    const material = new StudyMaterial(req.body);
    console.log('[Study Material] Material instance created');
    
    // Validate before saving
    const validationError = material.validateSync();
    if (validationError) {
      console.error('[Study Material] Validation failed:', validationError);
      return res.status(400).json({ message: 'Validation failed', error: validationError });
    }
    
    console.log('[Study Material] Validation passed, attempting save...');
    const savedMaterial = await material.save();
    console.log('[Study Material] ✅ SAVE SUCCESSFUL! Material ID:', savedMaterial._id);
    
    // Verify it was actually saved
    const verifyCount = await StudyMaterial.countDocuments();
    console.log('[Study Material] Total materials in DB after save:', verifyCount);
    
    clearCache('study-materials');
    console.log('[Study Material] Cache cleared');
    
    res.json(savedMaterial);
    console.log('[Study Material] ========== REQUEST COMPLETED ==========');
  } catch (error) {
    console.error('[Study Material] ❌ ERROR:', error.message);
    console.error('[Study Material] Error stack:', error.stack);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

const updateStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ message: 'Study Material not found' });
    clearCache('study-materials');
    clearCache('study-material');
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudyMaterial = async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    clearCache('study-materials');
    res.json({ message: 'Study Material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudyMaterials, getStudyMaterialById, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial, setClearCacheFunction };
