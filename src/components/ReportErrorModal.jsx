import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReportErrorModal = ({ questionId, onClose }) => {
    const [formData, setFormData] = useState({
        errorType: '',
        additionalDetails: '',
        reporterName: '',
        reporterEmail: '',
        reporterMobile: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const errorTypes = [
        'Wrong/Unclear Question',
        'Wrong/Unclear Option(s)',
        'Wrong/Blury/No Images(s)',
        'Incorrect Answer Key',
        'Wrong/Unclear Solution'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.errorType) {
            toast.error('Please select an error type');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/api/ncert/error-reports', {
                questionId,
                ...formData
            });
            
            toast.success('Error report submitted successfully! Thank you for your feedback.');
            onClose();
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('Failed to submit error report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-700 p-6 my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                        Report Error
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Select Error Type <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-2">
                            {errorTypes.map((type) => (
                                <label
                                    key={type}
                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        formData.errorType === type
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 bg-gray-800/30 hover:border-cyan-500/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="errorType"
                                        value={type}
                                        checked={formData.errorType === type}
                                        onChange={(e) => setFormData({ ...formData, errorType: e.target.value })}
                                        className="w-5 h-5 text-cyan-500"
                                    />
                                    <span className={`flex-1 ${formData.errorType === type ? 'text-cyan-400 font-medium' : 'text-gray-300'}`}>
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Please mention any additional details (Optional)
                        </label>
                        <textarea
                            value={formData.additionalDetails}
                            onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                            placeholder="Describe the issue in detail..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                        />
                    </div>

                    {/* Reporter Information */}
                    <div className="border-t border-gray-700 pt-5">
                        <h4 className="text-lg font-semibold text-white mb-4">Your Information</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.reporterName}
                                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.reporterEmail}
                                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mobile Number <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.reporterMobile}
                                    onChange={(e) => setFormData({ ...formData, reporterMobile: e.target.value })}
                                    placeholder="Enter your mobile number"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-400 hover:text-white transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    Submit Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportErrorModal;
