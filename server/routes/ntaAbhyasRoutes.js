const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ntaAbhyasController = require('../controllers/ntaAbhyasController');

// Configure multer for NTA Abhyas file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, Date.now() + '-' + cleanName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
]);

// Public routes
router.get('/chapters/:examCategory', ntaAbhyasController.getChapters);
router.get('/questions', ntaAbhyasController.getQuestions);
router.get('/stats', ntaAbhyasController.getStats);

// Admin routes — use multer so FormData (multipart) is parsed into req.body
router.get('/admin/all', ntaAbhyasController.getAllQuestions);
router.post('/admin/create', uploadFields, ntaAbhyasController.createQuestion);
router.put('/admin/update/:id', uploadFields, ntaAbhyasController.updateQuestion);
router.delete('/admin/delete/:id', ntaAbhyasController.deleteQuestion);

module.exports = router;
