const express = require('express');
const router = express.Router();
const { getStudyMaterials, getStudyMaterialById, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial } = require('../controllers/studyMaterialController');

router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.post('/', createStudyMaterial);
router.put('/:id', updateStudyMaterial);
router.delete('/:id', deleteStudyMaterial);

module.exports = router;
