import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ManageComments from './ManageComments';
import ManageFAQs from './ManageFAQs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Keep FAQ order stable while editing, saving, and displaying a blog. Older
// blogs may not have an order value, so their existing array position is used.
const normalizeFaqs = (faqs = []) => (
    Array.isArray(faqs) ? faqs : []
).map((faq, index) => ({
    ...(faq || {}),
    order: Number.isFinite(Number(faq?.order)) ? Number(faq.order) : index
})).sort((first, second) => first.order - second.order).map((faq, index) => ({
    ...faq,
    order: index
}));

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [stats, setStats] = useState(null);
    const [expandedEditor, setExpandedEditor] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(6); // 6 cards per page
    const [activeTab, setActiveTab] = useState('blogs'); // blogs, comments, faqs

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: 'JEE',
        excerpt: '',
        content: '',
        featuredImage: '',
        videoUrls: [],
        additionalImages: [],
        category: 'General',
        tags: [],
        isPublished: true,
        publishedDate: new Date().toISOString().split('T')[0],
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
        faqs: []
    });

    const categories = ['JEE', 'NEET', 'PSTET', 'Boards', 'Study Tips', 'Career Guidance', 'Chemistry', 'General'];

    useEffect(() => {
        fetchBlogs();
        fetchStats();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            // Add cache-busting parameter to ensure fresh data
            const response = await axios.get(`${API_URL}/blogs/admin/all?_t=${Date.now()}`);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            alert('Error fetching blogs');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/blogs/admin/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const blogPayload = {
                ...formData,
                faqs: normalizeFaqs(formData.faqs)
            };

            if (editingBlog) {
                const response = await axios.put(`${API_URL}/blogs/admin/${editingBlog._id}`, blogPayload);
                alert('Blog updated successfully!');

                // Update the blog in the local state immediately
                setBlogs(prevBlogs =>
                    prevBlogs.map(blog =>
                        blog._id === editingBlog._id ? response.data.blog : blog
                    )
                );
            } else {
                const response = await axios.post(`${API_URL}/blogs/admin`, blogPayload);
                alert('Blog created successfully!');

                // Add the new blog to the local state immediately
                setBlogs(prevBlogs => [response.data.blog, ...prevBlogs]);
            }

            resetForm();
            setShowModal(false);

            // Fetch fresh data with cache-busting
            await fetchBlogs();
            await fetchStats();
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setExpandedEditor(false);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            author: blog.author,
            excerpt: blog.excerpt,
            content: blog.content,
            featuredImage: blog.featuredImage || '',
            videoUrls: blog.videoUrls || [],
            additionalImages: blog.additionalImages || [],
            category: blog.category,
            tags: blog.tags || [],
            isPublished: blog.isPublished,
            publishedDate: new Date(blog.publishedDate).toISOString().split('T')[0],
            metaTitle: blog.metaTitle || '',
            metaDescription: blog.metaDescription || '',
            metaKeywords: blog.metaKeywords || [],
            faqs: normalizeFaqs(blog.faqs)
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            console.log('🗑️ Deleting blog with ID:', id);
            console.log('🔗 API URL:', `${API_URL}/blogs/admin/${id}`);

            // Wait for backend to confirm deletion
            const response = await axios.delete(`${API_URL}/blogs/admin/${id}`);

            console.log('✅ Delete response:', response.data);

            // Only update UI after successful backend deletion
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));

            alert('Blog deleted successfully!');

            // Refresh stats
            await fetchStats();
        } catch (error) {
            console.error('❌ Error deleting blog:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            alert('Error deleting blog: ' + (error.response?.data?.message || error.message));

            // Refresh data to sync with server state
            await fetchBlogs();
        }
    };

    const togglePublishStatus = async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/blogs/admin/${id}/toggle-publish`);

            // Update UI immediately
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === id ? { ...blog, isPublished: !blog.isPublished } : blog
                )
            );

            // Refresh stats
            await fetchStats();
        } catch (error) {
            console.error('Error toggling publish status:', error);
            alert('Error updating publish status: ' + (error.response?.data?.message || error.message));

            // Refresh data if toggle failed
            await fetchBlogs();
        }
    };

    const resetForm = () => {
        setExpandedEditor(false);
        setFormData({
            title: '',
            slug: '',
            author: 'JEE',
            excerpt: '',
            content: '',
            featuredImage: '',
            videoUrls: [],
            additionalImages: [],
            category: 'General',
            tags: [],
            isPublished: true,
            publishedDate: new Date().toISOString().split('T')[0],
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [],
            faqs: []
        });
        setEditingBlog(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update form data immediately to show preview
            const imageUrl = response.data.fileUrl;
            setFormData(prev => ({ ...prev, featuredImage: imageUrl }));

            alert('Image uploaded successfully!');

            // Force re-render by updating the key
            e.target.value = '';
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleVideoUrlInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newUrl = e.target.value.trim();
            if (!formData.videoUrls.includes(newUrl)) {
                setFormData(prev => ({ ...prev, videoUrls: [...prev.videoUrls, newUrl] }));
            }
            e.target.value = '';
        }
    };

    const handleVideoFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const uploadPromises = files.map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                const response = await axios.post(`${API_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data.fileUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                videoUrls: [...prev.videoUrls, ...uploadedUrls]
            }));
            alert(`${uploadedUrls.length} video(s) uploaded successfully!`);
            e.target.value = ''; // Reset file input
        } catch (error) {
            console.error('Error uploading videos:', error);
            alert('Error uploading videos');
        }
    };

    const removeVideoUrl = (urlToRemove) => {
        setFormData(prev => ({
            ...prev,
            videoUrls: prev.videoUrls.filter(url => url !== urlToRemove)
        }));
    };

    const handleAdditionalImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const uploadPromises = files.map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                const response = await axios.post(`${API_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data.fileUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...uploadedUrls]
            }));
            alert(`${uploadedUrls.length} image(s) uploaded successfully!`);
            e.target.value = ''; // Reset file input
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
        }
    };

    const removeAdditionalImage = (imageToRemove) => {
        setFormData(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter(img => img !== imageToRemove)
        }));
    };

    // FAQ Management Functions
    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqs: normalizeFaqs([
                ...prev.faqs,
                {
                    question: '',
                    answer: '',
                    order: prev.faqs.length,
                    _clientId: `faq-${Date.now()}-${Math.random().toString(36).slice(2)}`
                }
            ])
        }));
    };

    const updateFaq = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            faqs: normalizeFaqs(prev.faqs.map((faq, i) =>
                i === index ? { ...faq, [field]: value } : faq
            ))
        }));
    };

    const removeFaq = (index) => {
        setFormData(prev => ({
            ...prev,
            faqs: normalizeFaqs(prev.faqs.filter((_, i) => i !== index))
        }));
    };

    const moveFaqUp = (index) => {
        setFormData(prev => {
            if (index <= 0 || index >= prev.faqs.length) return prev;
            const newFaqs = [...prev.faqs];
            [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
            return { ...prev, faqs: normalizeFaqs(newFaqs) };
        });
    };

    const moveFaqDown = (index) => {
        setFormData(prev => {
            if (index < 0 || index >= prev.faqs.length - 1) return prev;
            const newFaqs = [...prev.faqs];
            [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
            return { ...prev, faqs: normalizeFaqs(newFaqs) };
        });
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Blog System Management</h1>
                <p className="text-gray-400">Manage blogs, comments, and FAQs</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-700 pb-1">
                <button
                    onClick={() => setActiveTab('blogs')}
                    className={`px-6 py-3 font-medium transition relative ${activeTab === 'blogs' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <i className="fas fa-blog mr-2"></i> Blogs
                    {activeTab === 'blogs' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-6 py-3 font-medium transition relative ${activeTab === 'comments' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <i className="fas fa-comments mr-2"></i> Comments
                    {activeTab === 'comments' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('faqs')}
                    className={`px-6 py-3 font-medium transition relative ${activeTab === 'faqs' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <i className="fas fa-question-circle mr-2"></i> FAQs
                    {activeTab === 'faqs' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'comments' && <ManageComments />}
            {activeTab === 'faqs' && <ManageFAQs />}

            {/* Statistics */}
            {activeTab === 'blogs' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Blogs</p>
                                <p className="text-3xl font-bold text-white">{stats.totalBlogs}</p>
                            </div>
                            <i className="fas fa-blog text-cyan-400 text-3xl"></i>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Published</p>
                                <p className="text-3xl font-bold text-white">{stats.publishedBlogs}</p>
                            </div>
                            <i className="fas fa-check-circle text-green-400 text-3xl"></i>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Drafts</p>
                                <p className="text-3xl font-bold text-white">{stats.draftBlogs}</p>
                            </div>
                            <i className="fas fa-file-alt text-yellow-400 text-3xl"></i>
                        </div>
                    </div>
                </div>
            )}



            {activeTab === 'blogs' && (
                <>

                    {/* Add New Button */}
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Create New Blog
                    </button>

                    {/* Blogs List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Pagination Logic */}
                            {(() => {
                                const indexOfLastBlog = currentPage * blogsPerPage;
                                const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
                                const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
                                const totalPages = Math.ceil(blogs.length / blogsPerPage);

                                return (
                                    <>
                                        <div className="grid gap-4">
                                            {currentBlogs.map((blog) => (
                                                <div
                                                    key={blog._id}
                                                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {/* Featured Image */}
                                                        {blog.featuredImage ? (
                                                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900">
                                                                <img
                                                                    src={blog.featuredImage}
                                                                    alt={blog.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        const placeholder = document.createElement('div');
                                                                        placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900';
                                                                        placeholder.innerHTML = '<i class="fas fa-image text-4xl text-gray-600"></i>';
                                                                        e.target.parentElement.appendChild(placeholder);
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                                <i className="fas fa-image text-4xl text-gray-600"></i>
                                                            </div>
                                                        )}

                                                        {/* Content */}
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-white mb-1">{blog.title}</h3>
                                                                    <p className="text-gray-400 text-sm mb-2">{blog.excerpt}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {blog.isPublished ? (
                                                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                                                                            Published
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                                                                            Draft
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <i className="fas fa-tag text-purple-400"></i>
                                                                    {blog.category}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <i className="fas fa-user text-cyan-400"></i>
                                                                    {blog.author}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <i className="fas fa-calendar text-green-400"></i>
                                                                    {new Date(blog.publishedDate).toLocaleDateString()}
                                                                </span>
                                                            </div>

                                                            {/* Tags */}
                                                            {blog.tags && blog.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {blog.tags.map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                                                                        >
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(blog)}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                                                >
                                                                    <i className="fas fa-edit mr-1"></i>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => togglePublishStatus(blog._id)}
                                                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                                                                >
                                                                    <i className={`fas fa-${blog.isPublished ? 'eye-slash' : 'eye'} mr-1`}></i>
                                                                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(blog._id)}
                                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                                                >
                                                                    <i className="fas fa-trash mr-1"></i>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-2 mt-6">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500 transition"
                                                >
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>

                                                <div className="flex gap-2">
                                                    {Array.from({ length: totalPages }).map((_, index) => (
                                                        <button
                                                            key={index + 1}
                                                            onClick={() => setCurrentPage(index + 1)}
                                                            className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === index + 1
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
                                );
                            })()}
                        </>
                    )}

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto p-4 sm:py-8">
                            <div className={`bg-gray-900 rounded-xl border border-gray-700 w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ${expandedEditor ? 'max-w-7xl' : 'max-w-4xl'
                                }`}>
                                <div className="p-6 border-b border-gray-700 flex justify-between items-center shrink-0 bg-gray-900">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setExpandedEditor(!expandedEditor)}
                                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                            title={expandedEditor ? 'Collapse Editor' : 'Expand Editor'}
                                        >
                                            <i className={`fas fa-${expandedEditor ? 'compress' : 'expand'}`}></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 flex-1 min-h-0 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            {/* Title */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                    required
                                                />
                                            </div>

                                            {/* Slug */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Slug <span className="text-gray-500 text-sm">(auto-generated if empty)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="my-blog-post"
                                                />
                                            </div>

                                            {/* Author */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Author</label>
                                                <input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Category</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                >
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Published Date */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Published Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.publishedDate}
                                                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>

                                            {/* Publish Status */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isPublished"
                                                    checked={formData.isPublished}
                                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                                                />
                                                <label htmlFor="isPublished" className="text-white font-medium">
                                                    Publish immediately
                                                </label>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            {/* Excerpt */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Excerpt <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={formData.excerpt}
                                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                    rows="3"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
                                                    placeholder="Brief description for blog cards..."
                                                    required
                                                />
                                            </div>

                                            {/* Featured Image */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Featured Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                />
                                                {formData.featuredImage && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={formData.featuredImage}
                                                            alt="Featured"
                                                            className="w-full h-40 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Tags <span className="text-gray-500 text-sm">(press Enter to add)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    onKeyDown={handleTagInput}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="Type tag and press Enter"
                                                />
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2"
                                                        >
                                                            #{tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="hover:text-red-400"
                                                            >
                                                                <i className="fas fa-times text-xs"></i>
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Meta Title */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Meta Title (SEO)</label>
                                                <input
                                                    type="text"
                                                    value={formData.metaTitle}
                                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="SEO optimized title"
                                                />
                                            </div>

                                            {/* Meta Description */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">Meta Description (SEO)</label>
                                                <textarea
                                                    value={formData.metaDescription}
                                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                                    rows="2"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
                                                    placeholder="SEO meta description"
                                                />
                                            </div>

                                            {/* Video URLs */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Videos <span className="text-gray-500 text-sm">(upload files or paste URLs)</span>
                                                </label>

                                                {/* Video File Upload */}
                                                <div className="mb-3">
                                                    <label className="block text-gray-400 text-sm mb-1">Upload Video Files:</label>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        multiple
                                                        onChange={handleVideoFileUpload}
                                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                    />
                                                </div>

                                                {/* Video URL Input */}
                                                <div>
                                                    <label className="block text-gray-400 text-sm mb-1">Or paste YouTube/Vimeo URL:</label>
                                                    <input
                                                        type="text"
                                                        onKeyDown={handleVideoUrlInput}
                                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                        placeholder="https://www.youtube.com/embed/VIDEO_ID (press Enter)"
                                                    />
                                                </div>

                                                {/* Video List */}
                                                <div className="flex flex-col gap-2 mt-3">
                                                    {formData.videoUrls.map((url, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm flex items-center justify-between gap-2"
                                                        >
                                                            <span className="truncate flex-1">
                                                                <i className="fas fa-video mr-2"></i>
                                                                {url}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVideoUrl(url)}
                                                                className="hover:text-red-400 flex-shrink-0"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    <i className="fas fa-info-circle mr-1"></i>
                                                    Upload video files or paste embed URLs. Videos will be playable in the blog post.
                                                </p>
                                            </div>

                                            {/* Additional Images */}
                                            <div>
                                                <label className="block text-white mb-2 font-medium">
                                                    Additional Images <span className="text-gray-500 text-sm">(select multiple files)</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleAdditionalImageUpload}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                />
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {formData.additionalImages.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`Additional ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAdditionalImage(image)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <i className="fas fa-times text-xs"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    <i className="fas fa-info-circle mr-1"></i>
                                                    Select multiple images at once. They will be displayed in a gallery within the blog post.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Editor - Full Width */}
                                    <div className="mt-6">
                                        <label className="block text-white mb-2 font-medium">
                                            Content <span className="text-red-500">*</span>
                                        </label>

                                        {/* Rich Text Editor */}
                                        <div className="quill-editor-wrapper quill-editor-black-text" style={{ height: expandedEditor ? '650px' : '450px' }}>
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.content}
                                                onChange={(content) => setFormData({ ...formData, content })}
                                                className="bg-white rounded-lg h-full"
                                                style={{ height: '100%' }}
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                        [{ 'font': [] }],
                                                        [{ 'size': ['small', false, 'large', 'huge'] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'color': [] }, { 'background': [] }],
                                                        [{ 'script': 'sub' }, { 'script': 'super' }],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                        [{ 'align': [] }],
                                                        ['link', 'image', 'video'],
                                                        ['blockquote', 'code-block'],
                                                        ['clean']
                                                    ]
                                                }}
                                                formats={[
                                                    'header', 'font', 'size',
                                                    'bold', 'italic', 'underline', 'strike',
                                                    'color', 'background',
                                                    'script',
                                                    'list', 'bullet', 'indent',
                                                    'align',
                                                    'link', 'image', 'video',
                                                    'blockquote', 'code-block'
                                                ]}
                                                placeholder="Write your blog content here... Use the toolbar above to format text, add headings, lists, and more!"
                                            />
                                        </div>
                                        <style jsx>{`
                                    .quill-editor-wrapper .ql-container {
                                        height: calc(100% - 42px) !important;
                                        overflow-y: auto;
                                    }
                                    .quill-editor-wrapper .ql-editor {
                                        min-height: 300px;
                                        font-size: 16px;
                                        line-height: 1.6;
                                    }
                                `}</style>

                                    </div>

                                    {/* FAQs Section */}
                                    <div className="mt-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <i className="fas fa-question-circle text-cyan-400"></i>
                                                Frequently Asked Questions
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addFaq}
                                                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm font-medium"
                                            >
                                                <i className="fas fa-plus mr-2"></i>
                                                Add FAQ
                                            </button>
                                        </div>

                                        {formData.faqs.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                                <i className="fas fa-question-circle text-4xl mb-3 opacity-50"></i>
                                                <p>No FAQs added yet. Click "Add FAQ" to create one.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formData.faqs.map((faq, index) => (
                                                    <div
                                                        key={faq._id || faq._clientId || `faq-${index}`}
                                                        className="glass-panel p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition"
                                                    >
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded">
                                                                    FAQ #{index + 1}
                                                                </span>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFaqUp(index)}
                                                                        disabled={index === 0}
                                                                        className="p-1 text-gray-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                                        title="Move up"
                                                                    >
                                                                        <i className="fas fa-chevron-up"></i>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFaqDown(index)}
                                                                        disabled={index === formData.faqs.length - 1}
                                                                        className="p-1 text-gray-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                                        title="Move down"
                                                                    >
                                                                        <i className="fas fa-chevron-down"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFaq(index)}
                                                                className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                                                title="Delete FAQ"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-gray-300 mb-2 text-sm font-medium">
                                                                    Question <span className="text-red-400">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={faq.question}
                                                                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                                    placeholder="What is your question?"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-gray-300 mb-2 text-sm font-medium">
                                                                    Answer <span className="text-red-400">*</span>
                                                                </label>
                                                                <textarea
                                                                    value={faq.answer}
                                                                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                                    rows="3"
                                                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
                                                                    placeholder="Provide a detailed answer..."
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                        >
                                            <i className="fas fa-save mr-2"></i>
                                            {editingBlog ? 'Update Blog' : 'Create Blog'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                resetForm();
                                            }}
                                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </>
            )}

        </div >
    );
};

export default ManageBlogs;
