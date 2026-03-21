import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const APP_LINK = 'https://play.google.com/store/apps/details?id=com.ace2examzapp.android';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AppDownload = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'success' | 'error'
  const { isDark } = useTheme();

  const handleGetLink = async (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) return;

    setLoading(true);
    setResult(null);

    const phoneDigits = `${countryCode.replace('+', '')}${mobileNumber}`;

    try {
      const response = await fetch(`${API_BASE}/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneDigits }),
      });
      const data = await response.json();
      setResult(data.success ? 'success' : 'error');
    } catch {
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get link in WhatsApp to download the app
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Download the Ace2Examz app and start learning on the go. Access all courses, live classes, and study materials from your mobile device.
            </p>

            {/* Form */}
            <form onSubmit={handleGetLink} className="mb-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Country Code */}
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full sm:w-28 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-4 text-gray-500 pointer-events-none text-xs"></i>
                </div>

                {/* Mobile Number */}
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g, '')); setResult(null); }}
                  placeholder="Enter mobile number"
                  maxLength="10"
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />

                <button
                  type="submit"
                  disabled={loading || mobileNumber.length < 10}
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending…
                    </>
                  ) : (
                    'Get the link'
                  )}
                </button>
              </div>
            </form>

            {/* Inline result message */}
            {result === 'success' && (
              <p className="text-green-400 text-sm font-semibold flex items-center gap-2 mt-1">
                <i className="fas fa-check-circle"></i>
                WhatsApp link sent to {countryCode} {mobileNumber} successfully!
              </p>
            )}
            {result === 'error' && (
              <div className="mt-1 text-sm bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  Couldn't send automatically. Use one of these:
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${countryCode.replace('+','')}${mobileNumber}?text=${encodeURIComponent('📲 Download the Ace2Examz App: ' + APP_LINK)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600/80 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition text-xs"
                  >
                    <i className="fab fa-whatsapp text-base"></i>
                    Open WhatsApp & send link to myself
                  </a>
                  <a
                    href={APP_LINK} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition text-xs"
                  >
                    <i className="fab fa-google-play text-green-400"></i>
                    Download directly from Play Store
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Overlapping Images */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-[500px]">
              <div className="absolute left-0 top-0 w-3/5 h-full">
                <img src="/07.png" alt="App Download" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="absolute right-0 top-0 w-3/5 h-full">
                <img src="/09.png" alt="App Features" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
