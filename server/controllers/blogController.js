const Blog = require('../models/Blog');

// Helper function to generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Get all published blogs (Frontend)
exports.getAllBlogs = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;

        const blogs = await Blog.find(query)
            .select('title slug author excerpt featuredImage category tags views publishedDate')
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};

// Get single blog by slug (Frontend)
exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug, isPublished: true });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Error fetching blog', error: error.message });
    }
};

// Get related blogs
exports.getRelatedBlogs = async (req, res) => {
    try {
        const { slug } = req.params;
        const { limit = 4 } = req.query;

        const currentBlog = await Blog.findOne({ slug });
        if (!currentBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Find related blogs based on category and tags
        const relatedBlogs = await Blog.find({
            _id: { $ne: currentBlog._id },
            isPublished: true,
            $or: [
                { category: currentBlog.category },
                { tags: { $in: currentBlog.tags } }
            ]
        })
            .select('title slug author excerpt featuredImage category views publishedDate')
            .sort({ publishedDate: -1 })
            .limit(parseInt(limit));

        res.json(relatedBlogs);
    } catch (error) {
        console.error('Error fetching related blogs:', error);
        res.status(500).json({ message: 'Error fetching related blogs', error: error.message });
    }
};

// ============ ADMIN ROUTES ============

// Get all blogs for admin (including unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs for admin:', error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};

// Get single blog by ID (Admin)
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Error fetching blog', error: error.message });
    }
};

// Create new blog
exports.createBlog = async (req, res) => {
    try {
        const blogData = req.body;

        // Generate slug if not provided
        if (!blogData.slug) {
            blogData.slug = generateSlug(blogData.title);
        } else {
            blogData.slug = generateSlug(blogData.slug);
        }

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug: blogData.slug });
        if (existingBlog) {
            // Add timestamp to make it unique
            blogData.slug = `${blogData.slug}-${Date.now()}`;
        }

        const blog = new Blog(blogData);
        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If title is changed, regenerate slug
        if (updateData.title) {
            const blog = await Blog.findById(id);
            if (blog && blog.title !== updateData.title) {
                updateData.slug = generateSlug(updateData.title);

                // Check if new slug already exists
                const existingBlog = await Blog.findOne({ slug: updateData.slug, _id: { $ne: id } });
                if (existingBlog) {
                    updateData.slug = `${updateData.slug}-${Date.now()}`;
                }
            }
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};

// Toggle publish status
exports.togglePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();

        res.json({ message: 'Blog publish status updated', blog });
    } catch (error) {
        console.error('Error toggling publish status:', error);
        res.status(500).json({ message: 'Error updating publish status', error: error.message });
    }
};

// Get blog statistics
exports.getBlogStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ isPublished: true });
        const draftBlogs = await Blog.countDocuments({ isPublished: false });
        const totalViews = await Blog.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        const categoryStats = await Blog.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalViews: totalViews[0]?.total || 0,
            categoryStats
        });
    } catch (error) {
        console.error('Error fetching blog stats:', error);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};
