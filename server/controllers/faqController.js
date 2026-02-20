const FAQ = require('../models/FAQ');

// Get active FAQs (Public)
exports.getActiveFAQs = async (req, res) => {
    try {
        const { category, search, limit = 10 } = req.query;

        let query = { isActive: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const faqs = await FAQ.find(query)
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json(faqs);
    } catch (error) {
        console.error('❌ [GET ACTIVE FAQS] Error:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
};

// Get FAQs by category (Public)
exports.getFAQsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const faqs = await FAQ.find({ category, isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json(faqs);
    } catch (error) {
        console.error('❌ [GET FAQS BY CATEGORY] Error:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
};

// Get FAQs for a specific blog (Public)
exports.getFAQsForBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { limit = 4 } = req.query;

        const faqs = await FAQ.find({
            relatedBlogs: blogId,
            isActive: true
        })
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json(faqs);
    } catch (error) {
        console.error('❌ [GET FAQS FOR BLOG] Error:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
};

// Get all FAQs (Admin)
exports.getAllFAQsAdmin = async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const faqs = await FAQ.find(query)
            .populate('relatedBlogs', 'title slug')
            .sort({ order: 1, createdAt: -1 });

        res.json(faqs);
    } catch (error) {
        console.error('❌ [GET ALL FAQS ADMIN] Error:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
};

// Get FAQ statistics (Admin)
exports.getFAQStats = async (req, res) => {
    try {
        const totalFAQs = await FAQ.countDocuments();
        const activeFAQs = await FAQ.countDocuments({ isActive: true });
        const inactiveFAQs = await FAQ.countDocuments({ isActive: false });

        const categoryStats = await FAQ.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const totalViews = await FAQ.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        res.json({
            totalFAQs,
            activeFAQs,
            inactiveFAQs,
            categoryStats,
            totalViews: totalViews[0]?.total || 0
        });
    } catch (error) {
        console.error('❌ [GET FAQ STATS] Error:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// Create FAQ (Admin)
exports.createFAQ = async (req, res) => {
    try {
        const faqData = req.body;

        const faq = new FAQ(faqData);
        await faq.save();

        console.log('✅ [CREATE FAQ] New FAQ created:', faq.question);

        res.status(201).json({ message: 'FAQ created successfully', faq });
    } catch (error) {
        console.error('❌ [CREATE FAQ] Error:', error);
        res.status(500).json({ message: 'Error creating FAQ', error: error.message });
    }
};

// Update FAQ (Admin)
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const faq = await FAQ.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        console.log('✅ [UPDATE FAQ] FAQ updated:', id);

        res.json({ message: 'FAQ updated successfully', faq });
    } catch (error) {
        console.error('❌ [UPDATE FAQ] Error:', error);
        res.status(500).json({ message: 'Error updating FAQ', error: error.message });
    }
};

// Delete FAQ (Admin)
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        console.log('✅ [DELETE FAQ] FAQ deleted:', id);

        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('❌ [DELETE FAQ] Error:', error);
        res.status(500).json({ message: 'Error deleting FAQ', error: error.message });
    }
};

// Increment FAQ view count
exports.incrementFAQView = async (req, res) => {
    try {
        const { id } = req.params;

        await FAQ.findByIdAndUpdate(id, { $inc: { views: 1 } });

        res.json({ message: 'View count updated' });
    } catch (error) {
        console.error('❌ [INCREMENT FAQ VIEW] Error:', error);
        res.status(500).json({ message: 'Error updating view count', error: error.message });
    }
};
