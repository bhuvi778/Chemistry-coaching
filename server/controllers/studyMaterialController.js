const StudyMaterial = require('../models/StudyMaterial');

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
    const material = new StudyMaterial(req.body);
    await material.save();
    clearCache('study-materials');
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
