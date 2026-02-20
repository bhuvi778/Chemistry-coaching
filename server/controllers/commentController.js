const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Create a new comment (Public)
exports.createComment = async (req, res) => {
    try {
        const { blogId, userName, userEmail, comment } = req.body;

        // Validate required fields
        if (!blogId || !userName || !userEmail || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Create comment (pending approval)
        const newComment = new Comment({
            blogId,
            userName,
            userEmail,
            comment,
            isApproved: false
        });

        await newComment.save();

        console.log('✅ [CREATE COMMENT] New comment created:', {
            blogId,
            userName,
            userEmail
        });

        res.status(201).json({
            message: 'Comment submitted successfully! It will appear after admin approval.',
            comment: newComment
        });
    } catch (error) {
        console.error('❌ [CREATE COMMENT] Error:', error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

// Get approved comments for a blog (Public)
exports.getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({ blogId, isApproved: true })
            .sort({ createdAt: -1 })
            .select('-userEmail'); // Don't expose emails publicly

        res.json(comments);
    } catch (error) {
        console.error('❌ [GET BLOG COMMENTS] Error:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// Get all comments (Admin)
exports.getAllCommentsAdmin = async (req, res) => {
    try {
        const { status } = req.query; // 'pending', 'approved', or 'all'

        let query = {};
        if (status === 'pending') {
            query.isApproved = false;
        } else if (status === 'approved') {
            query.isApproved = true;
        }

        const comments = await Comment.find(query)
            .populate('blogId', 'title slug')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('❌ [GET ALL COMMENTS] Error:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// Get comment statistics (Admin)
exports.getCommentStats = async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments();
        const pendingComments = await Comment.countDocuments({ isApproved: false });
        const approvedComments = await Comment.countDocuments({ isApproved: true });

        // Get recent comments
        const recentComments = await Comment.find()
            .populate('blogId', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalComments,
            pendingComments,
            approvedComments,
            recentComments
        });
    } catch (error) {
        console.error('❌ [GET COMMENT STATS] Error:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// Approve comment (Admin)
exports.approveComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.isApproved = true;
        await comment.save();

        // Update blog comment count
        await Blog.findByIdAndUpdate(
            comment.blogId,
            { $inc: { commentCount: 1 } }
        );

        console.log('✅ [APPROVE COMMENT] Comment approved:', id);

        res.json({ message: 'Comment approved successfully', comment });
    } catch (error) {
        console.error('❌ [APPROVE COMMENT] Error:', error);
        res.status(500).json({ message: 'Error approving comment', error: error.message });
    }
};

// Delete comment (Admin)
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // If comment was approved, decrement blog comment count
        if (comment.isApproved) {
            await Blog.findByIdAndUpdate(
                comment.blogId,
                { $inc: { commentCount: -1 } }
            );
        }

        await Comment.findByIdAndDelete(id);

        console.log('✅ [DELETE COMMENT] Comment deleted:', id);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('❌ [DELETE COMMENT] Error:', error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};
