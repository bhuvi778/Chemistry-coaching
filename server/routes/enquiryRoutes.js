const express = require('express');
const router = express.Router();
const { getEnquiries, createEnquiry, deleteEnquiry } = require('../controllers/enquiryController');

router.get('/', getEnquiries);
router.post('/', createEnquiry);
router.delete('/:id', deleteEnquiry);

module.exports = router;
