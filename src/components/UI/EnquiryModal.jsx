import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const EnquiryModal = ({ isOpen, onClose, course }) => {
  const { addEnquiry } = useData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const enquiryData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      course: course.title,
      message: formData.message,
      date: new Date().toISOString()
    };

    try {
      await addEnquiry(enquiryData);
      
      setShowSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto pt-24" style={{ zIndex: 40 }} onClick={onClose}>
      <div className="glass-panel rounded-2xl max-w-3xl w-full p-8 relative border border-cyan-500/30 my-8" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <i className="fas fa-times text-2xl"></i>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Enquire Now</h2>
          <p className="text-cyan-400 font-semibold">{course.title}</p>
          <p className="text-gray-400 text-sm mt-1">Fill the form and we'll call you back shortly</p>
        </div>

        {showSuccess ? (
          <div className="py-12 text-center">
            <div className="mb-4">
              <i className="fas fa-check-circle text-6xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Enquiry Submitted!</h3>
            <p className="text-gray-400">We'll contact you soon</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout for Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <i className="fas fa-user mr-2 text-cyan-400"></i>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <i className="fas fa-phone mr-2 text-cyan-400"></i>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition"
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Email - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <i className="fas fa-envelope mr-2 text-cyan-400"></i>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition"
                placeholder="Enter your email (optional)"
              />
            </div>

            {/* Message - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <i className="fas fa-comment mr-2 text-cyan-400"></i>
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition resize-none"
                placeholder="Any specific questions? (optional)"
                rows="4"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
