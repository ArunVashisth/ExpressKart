const Enquiry = require('../models/Enquiry');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = asyncHandler(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return next(new ErrorResponse('Please provide all required fields', 400));
    }

    const enquiry = await Enquiry.create({
        name,
        email,
        subject,
        message
    });

    res.status(201).json({
        success: true,
        data: enquiry
    });
});

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
exports.getAllEnquiries = asyncHandler(async (req, res, next) => {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: enquiries.length,
        data: enquiries
    });
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
exports.updateEnquiryStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, {
        new: true,
        runValidators: true
    });

    if (!enquiry) {
        return next(new ErrorResponse(`No enquiry found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: enquiry
    });
});

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
exports.deleteEnquiry = asyncHandler(async (req, res, next) => {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
        return next(new ErrorResponse(`No enquiry found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});
