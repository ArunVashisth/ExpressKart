const express = require('express');
const {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
} = require('../controllers/enquiryController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public route to submit contact form
router.post('/', createEnquiry);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllEnquiries);
router.route('/:id')
    .put(updateEnquiryStatus)
    .delete(deleteEnquiry);

module.exports = router;
