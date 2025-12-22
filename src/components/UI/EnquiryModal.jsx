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
      // Save enquiry to database
      await addEnquiry(enquiryData);

      // Send WhatsApp message using BotBiz API
      try {
        // Format phone number - ensure it has country code (91 for India)
        let phoneNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
        if (phoneNumber.length === 10) {
          phoneNumber = '91' + phoneNumber; // Add India country code if 10 digits
        }

        const whatsappPayload = new URLSearchParams();
        whatsappPayload.append('apiToken', '16122|Ot9YpB7Zp4v0U9i9MI7A9ns4HYo6BtTy2zij0tTD41fabf26');
        whatsappPayload.append('phone_number_id', '884991348021443');
        whatsappPayload.append('template_id', '280021');
        
        // Use 'to' for recipient phone number
        whatsappPayload.append('to', phoneNumber);
        
        // Use body_variables format with text objects
        const bodyVariables = [
          { "text": formData.name },
          { "text": course.title }
        ];
        whatsappPayload.append('body_variables', JSON.stringify(bodyVariables));

        console.log('Sending WhatsApp for enquiry:', {
          name: formData.name,
          course: course.title,
          to: phoneNumber,
          body_variables: bodyVariables
        });

        const whatsappApiUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send/template';
        const response = await fetch(whatsappApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: whatsappPayload.toString()
        });

        const result = await response.json();
        console.log('WhatsApp API Response:', result);

        if (!response.ok) {
          console.error('WhatsApp API Error:', result);
          // Don't fail the entire submission if WhatsApp fails
        }
      } catch (whatsappError) {
        console.error('Error sending WhatsApp message:', whatsappError);
        // Don't fail the entire submission if WhatsApp fails
      }

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 animate-fadeIn overflow-y-auto pt-28" style={{ zIndex: 40 }} onClick={onClose}>
      <div className="glass-panel rounded-2xl max-w-3xl w-full p-8 relative border border-cyan-500/30 mt-4" onClick={(e) => e.stopPropagation()}>
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

            {/* Consent Checkbox - Mandatory */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I would like to receive communication via <strong className="text-white">SMS, Email, OBD, Google RCS, and WhatsApp</strong> regarding my services, offers, and updates. <span className="text-red-400">*</span>
                </span>
              </label>
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
