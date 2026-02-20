import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/Blog/CommentSection';
import ShareButtons from '../components/Blog/ShareButtons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState(null);

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            // Add cache-busting parameter to ensure fresh data
            const timestamp = Date.now();

            // First fetch the blog to get its category
            const blogResponse = await axios.get(`${API_URL}/blogs/slug/${slug}?_=${timestamp}`);
            const blogData = blogResponse.data;
            setBlog(blogData);

            // Set blog-specific FAQs
            setFaqs(blogData.faqs || []);

            // Fetch related blogs
            const relatedResponse = await axios.get(`${API_URL}/blogs/related/${slug}?limit=4&_=${timestamp}`);
            setRelatedBlogs(relatedResponse.data);
        } catch (error) {
            console.error('Error fetching blog data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                    <h1 className="text-3xl font-bold text-white mb-4">Blog Not Found</h1>
                    <Link to="/blogs" className="text-cyan-400 hover:text-cyan-300">
                        ← Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition"
                >
                    <i className="fas fa-arrow-left"></i>
                    Back to Blogs
                </Link>

                {/* Blog Header */}
                <div className="mb-8">
                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className="px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-full">
                            {blog.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                                <i className="fas fa-user text-white"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Written by</p>
                                <p className="text-cyan-400 font-medium">{blog.author}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div>
                            <p className="text-sm text-gray-500">Published on</p>
                            <p className="text-white">{formatDate(blog.publishedDate)}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-eye text-cyan-400"></i>
                            <span>{blog.views} views</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <div className="mb-10 rounded-xl overflow-hidden">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Blog Content */}
                <div className="glass-panel rounded-xl p-8 md:p-12 border border-gray-700 mb-12">
                    <div
                        className="blog-content prose prose-invert prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Embedded Videos */}
                {blog.videoUrls && blog.videoUrls.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-video text-purple-500"></i>
                            Related Videos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blog.videoUrls.map((videoUrl, index) => (
                                <div key={index} className="glass-panel rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition">
                                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={videoUrl}
                                            className="absolute top-0 left-0 w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={`Video ${index + 1}`}
                                        ></iframe>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Images Gallery */}
                {blog.additionalImages && blog.additionalImages.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-images text-cyan-500"></i>
                            Image Gallery
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {blog.additionalImages.map((image, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-700 hover:border-cyan-500 transition cursor-pointer">
                                    <img
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <p className="text-white text-sm">
                                            <i className="fas fa-search-plus mr-2"></i>
                                            Click to view
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQs Section */}
                {faqs.length > 0 && (
                    <div className="glass-panel rounded-xl p-8 border border-gray-700 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <i className="fas fa-question-circle text-cyan-500 text-2xl"></i>
                            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={faq._id || index}
                                    className="border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full p-4 bg-gray-800/50 hover:bg-gray-800 transition text-left flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-cyan-400 font-bold text-sm">Q{index + 1}</span>
                                            </div>
                                            <p className="text-white font-medium flex-1">{faq.question}</p>
                                        </div>
                                        <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                    <i className="fas fa-check text-green-400 text-sm"></i>
                                                </div>
                                                <p className="text-gray-300 leading-relaxed flex-1 whitespace-pre-line">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link
                                    key={relatedBlog._id}
                                    to={`/blog/${relatedBlog.slug}`}
                                    className="group glass-panel rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
                                >
                                    {relatedBlog.featuredImage && (
                                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                            <img
                                                src={relatedBlog.featuredImage}
                                                alt={relatedBlog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                                                    {relatedBlog.category}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium">
                                                {relatedBlog.author}
                                            </span>
                                            <span>•</span>
                                            <span>{formatDate(relatedBlog.publishedDate)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                            {relatedBlog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-star text-yellow-500"></i>
                                                <span>{relatedBlog.views} views</span>
                                            </div>
                                            <span className="text-purple-400 font-medium flex items-center gap-2">
                                                Read
                                                <i className="fas fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Buttons */}
                <ShareButtons
                    blogId={blog._id}
                    blogTitle={blog.title}
                    blogSlug={blog.slug}
                />

                {/* Comment Section */}
                <div className="mt-12">
                    <CommentSection blogId={blog._id} />
                </div>
            </div>

            {/* Custom Styles for Blog Content */}
            <style jsx>{`
        .blog-content {
          color: #e5e7eb;
          line-height: 1.8;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        
        .blog-content * {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .blog-content h2 {
          color: #06b6d4;
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          word-break: break-word;
        }
        
        .blog-content h3 {
          color: #a855f7;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          word-break: break-word;
        }
        
        .blog-content p {
          margin-bottom: 1rem;
          color: #d1d5db;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          padding-right: 1rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #d1d5db;
          word-break: break-word;
        }
        
        .blog-content strong {
          color: #ffffff;
          font-weight: 600;
        }
        
        .blog-content a {
          color: #06b6d4;
          text-decoration: underline;
          word-break: break-all;
        }
        
        .blog-content a:hover {
          color: #22d3ee;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #06b6d4;
          padding-left: 1rem;
          padding-right: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #9ca3af;
          word-break: break-word;
        }
        
        .blog-content code {
          background-color: rgba(6, 182, 212, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #06b6d4;
          word-break: break-all;
          overflow-wrap: break-word;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
          max-width: 100%;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          word-break: normal;
          overflow-wrap: normal;
        }
        
        .blog-content img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          max-width: 100%;
          height: auto;
        }
        
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          max-width: 100%;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          overflow-x: auto;
          display: block;
        }
        
        .blog-content table th,
        .blog-content table td {
          border: 1px solid #374151;
          padding: 0.5rem;
          word-break: break-word;
        }
        
        .blog-content table th {
          background-color: #1f2937;
          color: #06b6d4;
          font-weight: 600;
        }
      `}</style>
        </div>
    );
};

export default BlogDetail;
