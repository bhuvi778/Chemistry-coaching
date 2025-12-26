import { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminSettings = () => {
    const { updateAdminCredentials } = useData();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (!currentPassword) {
            setMessage({ type: 'error', text: 'Please enter your current password' });
            return;
        }

        if (!newUsername && !newPassword) {
            setMessage({ type: 'error', text: 'Please enter new username or password' });
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current username from localStorage
            const currentUsername = localStorage.getItem('admin_username') || 'admin';

            // Call backend API to update credentials
            const response = await fetch('/api/admin/update-credentials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentUsername,
                    currentPassword,
                    newUsername: newUsername || undefined,
                    newPassword: newPassword || undefined
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update localStorage with new credentials
                if (newUsername) {
                    localStorage.setItem('admin_username', newUsername);
                }
                // Note: We don't store password in localStorage anymore

                setMessage({
                    type: 'success',
                    text: `Credentials updated successfully! ${newUsername ? 'New username: ' + newUsername : ''} ${newPassword ? '(Password changed)' : ''}`
                });

                // Clear form
                setCurrentPassword('');
                setNewUsername('');
                setNewPassword('');
                setConfirmPassword('');

                // If username was changed, show additional message
                if (newUsername) {
                    setTimeout(() => {
                        setMessage({
                            type: 'success',
                            text: `Please remember your new username: ${newUsername}`
                        });
                    }, 2000);
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update credentials' });
            }

        } catch (error) {
            console.error('Error updating credentials:', error);
            setMessage({ type: 'error', text: 'Server error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                    <i className="fas fa-cog mr-3 text-cyan-400"></i>
                    Admin Settings
                </h2>

                {/* Current Credentials Info */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <h3 className="text-blue-400 font-semibold mb-2">
                        <i className="fas fa-info-circle mr-2"></i>
                        Current Credentials
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Username: <span className="text-white font-mono">{localStorage.getItem('admin_username') || 'admin'}</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        Password: <span className="text-white">••••••••</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-gray-400 mb-2 font-semibold">
                            <i className="fas fa-lock mr-2 text-red-400"></i>
                            Current Password *
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password to verify"
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                            Update Credentials (Optional)
                        </h3>

                        {/* New Username */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2 font-semibold">
                                <i className="fas fa-user mr-2 text-cyan-400"></i>
                                New Username
                            </label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Leave blank to keep current username"
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2 font-semibold">
                                <i className="fas fa-key mr-2 text-green-400"></i>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-500 focus:outline-none"
                            />
                            {newPassword && newPassword.length < 6 && (
                                <p className="text-red-400 text-sm mt-1">
                                    <i className="fas fa-exclamation-circle mr-1"></i>
                                    Password must be at least 6 characters
                                </p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        {newPassword && (
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2 font-semibold">
                                    <i className="fas fa-check-circle mr-2 text-green-400"></i>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-500 focus:outline-none"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-red-400 text-sm mt-1">
                                        <i className="fas fa-times-circle mr-1"></i>
                                        Passwords do not match
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-900/30 border border-green-500/50 text-green-400'
                                : 'bg-red-900/30 border border-red-500/50 text-red-400'
                            }`}>
                            <i className={`fas fa-${message.type === 'success' ? 'check' : 'exclamation'}-circle mr-2`}></i>
                            {message.text}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full font-bold py-3 px-6 rounded transition ${isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                            } text-white`}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Update Credentials
                            </>
                        )}
                    </button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">
                        <i className="fas fa-shield-alt mr-2"></i>
                        Security Notice
                    </h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                        <li><i className="fas fa-check text-green-400 mr-2"></i>Use a strong password with letters, numbers, and symbols</li>
                        <li><i className="fas fa-check text-green-400 mr-2"></i>Don't share your credentials with anyone</li>
                        <li><i className="fas fa-check text-green-400 mr-2"></i>Change your password regularly</li>
                        <li><i className="fas fa-check text-green-400 mr-2"></i>Remember your new credentials - they cannot be recovered</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
