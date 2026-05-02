import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

const CLASS_OPTIONS = [
  'Class 11', 'Class 12', 'Dropper / 12th Pass', 'Other'
];

const EXAM_OPTIONS = [
  'NEET', 'JEE Main', 'JEE Advanced', 'AIIMS', 'KVPY', 'Boards (12th)', 'Other'
];

const LeadCapturePopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    classLevel: '',
    exam: ''
  });

  // Check popup settings and schedule display
  useEffect(() => {
    // Don't show if already submitted/dismissed in this session
    if (sessionStorage.getItem('leadPopupDone')) return;

    const fetchAndSchedule = async () => {
      try {
        const res = await axios.get(`${API_URL}/lead-capture/settings`);
        const settings = res.data;
        if (!settings.isActive) return;

        const delay = (settings.delaySeconds || 45) * 1000;
        const timer = setTimeout(() => {
          setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
      } catch {
        // If settings fetch fails, use default 45s delay
        const timer = setTimeout(() => {
          setVisible(true);
        }, 45000);
        return () => clearTimeout(timer);
      }
    };

    fetchAndSchedule();
  }, []);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('leadPopupDone', '1');
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.whatsapp.trim() || !form.classLevel || !form.exam) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(form.whatsapp.trim())) {
      toast.error('Enter a valid 10-digit WhatsApp number');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/lead-capture/leads`, form);
      setSubmitted(true);
      sessionStorage.setItem('leadPopupDone', '1');
      toast.success('Thank you! You will receive free content soon.');
      setTimeout(() => setVisible(false), 2500);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/80 text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200 text-lg font-bold z-20"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6 pt-8">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-3 shadow-lg shadow-cyan-500/30">
              <i className="fas fa-gift text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Get Free Content</h2>
            <p className="text-gray-400 text-sm mt-1">
              Fill in your details and unlock exclusive free study material!
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-cyan-400 font-semibold text-lg">Thank you!</p>
              <p className="text-gray-400 text-sm mt-1">We'll send free content to your WhatsApp shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-3 py-2.5 bg-gray-700/60 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-400 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    maxLength={10}
                    className="flex-1 px-3 py-2.5 bg-gray-700/60 border border-gray-600 rounded-r-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">
                  Email <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 bg-gray-700/60 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">
                  Class <span className="text-red-400">*</span>
                </label>
                <select
                  name="classLevel"
                  value={form.classLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-700/60 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition appearance-none"
                  required
                >
                  <option value="" disabled>Select your class</option>
                  {CLASS_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">
                  Target Exam <span className="text-red-400">*</span>
                </label>
                <select
                  name="exam"
                  value={form.exam}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-700/60 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition appearance-none"
                  required
                >
                  <option value="" disabled>Select your exam</option>
                  {EXAM_OPTIONS.map(ex => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" />
                    Get Free Content
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs mt-1">
                No spam, ever. We respect your privacy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCapturePopup;
