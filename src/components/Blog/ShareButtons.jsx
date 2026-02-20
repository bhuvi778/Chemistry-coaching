import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ShareButtons = ({ blogId, blogTitle, blogSlug }) => {
    const [shareCount, setShareCount] = useState(0);
    const [copied, setCopied] = useState(false);

    const blogUrl = `${window.location.origin}/blog/${blogSlug}`;

    console.log('🔗 ShareButtons mounted:', { blogId, blogTitle, blogSlug });

    const handleShare = async (platform) => {
        try {
            // Increment share count on backend
            const response = await axios.patch(`${API_URL}/blogs/${blogId}/share`);
            setShareCount(response.data.shareCount);

            // Open share dialog based on platform
            let shareUrl = '';
            const encodedUrl = encodeURIComponent(blogUrl);
            const encodedTitle = encodeURIComponent(blogTitle);

            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                    break;
                default:
                    return;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(blogUrl);
            setCopied(true);

            // Increment share count for copy link too
            const response = await axios.patch(`${API_URL}/blogs/${blogId}/share`);
            setShareCount(response.data.shareCount);

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="glass-panel rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-share-alt text-cyan-400"></i>
                Share this article
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {/* Facebook */}
                <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </button>

                {/* Twitter */}
                <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition font-medium"
                >
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition font-medium"
                >
                    <i className="fab fa-linkedin-in"></i>
                    <span>LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                    <i className="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </button>

                {/* Copy Link */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium col-span-2 md:col-span-1"
                >
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
            </div>

            {shareCount > 0 && (
                <div className="text-center text-gray-400 text-sm">
                    <i className="fas fa-eye mr-2"></i>
                    {shareCount} {shareCount === 1 ? 'share' : 'shares'}
                </div>
            )}
        </div>
    );
};

export default ShareButtons;
