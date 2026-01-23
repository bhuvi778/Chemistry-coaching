import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['All', 'JEE', 'NEET', 'Boards', 'Study Tips', 'Career Guidance', 'Chemistry', 'General'];

    useEffect(() => {
        fetchBlogs();
    }, [selectedCategory, searchQuery, currentPage]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12
            };

            if (selectedCategory !== 'All') {
                params.category = selectedCategory;
            }

            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await axios.get(`${API_URL}/blogs`, { params });
            setBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Chemistry Learning Blog
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Expert insights, study tips, and career guidance for JEE, NEET, and Board exam aspirants
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition"
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                {/* Category Filter */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-cyan-500 hover:text-cyan-400'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400 text-xl">No blogs found</p>
                    </div>
                ) : (
                    <>
                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blog/${blog.slug}`}
                                    className="group glass-panel rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
                                >
                                    {/* Featured Image */}
                                    {blog.featuredImage && (
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                            <img
                                                src={blog.featuredImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                                                    {blog.category}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Author & Date */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                                                <i className="fas fa-book text-white text-sm"></i>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium">
                                                    {blog.author}
                                                </span>
                                                <span>•</span>
                                                <span>{formatDate(blog.publishedDate)}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition">
                                            {blog.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {blog.excerpt}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-star text-yellow-500"></i>
                                                <span>{blog.views} views</span>
                                            </div>
                                            <span className="text-purple-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                                Read
                                                <i className="fas fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500 transition"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === index + 1
                                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                                                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-cyan-500'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500 transition"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blogs;
