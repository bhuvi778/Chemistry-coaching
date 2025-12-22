import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AppDownload = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const { isDark } = useTheme();

  const handleGetLink = async (e) => {
    e.preventDefault();

    if (mobileNumber.length < 10) {
      setMessage('Please enter a valid 10-digit mobile number');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setMessage('Sending link...');

      // Format phone number with country code (remove + sign for API)
      const fullPhoneNumber = `${countryCode.replace('+', '')}${mobileNumber}`;

      console.log('=== WhatsApp Template Send ===');
      console.log('Phone:', fullPhoneNumber);
      console.log('API Endpoint: /api/send-whatsapp');
      console.log('========================');

      // Call backend API which will use WhatsApp template
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: fullPhoneNumber
        })
      });

      console.log('API response status:', response.status); // Debug log

      // Parse response
      let responseData;
      try {
        responseData = await response.json();
        console.log('=== FULL API RESPONSE ===');
        console.log('Success:', responseData?.success);
        console.log('Error:', responseData?.error);
        console.log('Details:', responseData?.details);
        console.log('Full Response:', JSON.stringify(responseData, null, 2));
        console.log('========================');
      } catch (e) {
        console.log('Could not parse response as JSON');
      }

      if (response.ok && responseData?.success) {
        setMessage('✓ App download link sent to your WhatsApp!');
        setMobileNumber('');
      } else {
        // Extract detailed error information
        let errorMsg = 'Failed to send link';

        if (responseData?.details) {
          errorMsg = responseData.details;
        } else if (responseData?.error) {
          errorMsg = responseData.error;
        }

        // Add suggestion if available
        if (responseData?.suggestion) {
          errorMsg += '. ' + responseData.suggestion;
        }

        // Log full error for debugging
        console.error('=== Full Error Details ===');
        console.error('Status:', response.status);
        console.error('Response Data:', responseData);
        if (responseData?.fullResponse) {
          console.error('BotBiz API Response:', responseData.fullResponse);
        }
        console.error('========================');

        // Show error with suggestion
        setMessage(`⚠ ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      setMessage('⚠ Network error. Please check your connection and try again.');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get link in WhatsApp to download the app
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Download the Ace2Examz app and start learning on the go. Access all courses, live classes, and study materials from your mobile device.
            </p>

            {/* Mobile Number Input Form */}
            <form onSubmit={handleGetLink} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Country Code Dropdown */}
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

                {/* Mobile Number Input */}
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter mobile number"
                  maxLength="10"
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />

                {/* Get Link Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                >
                  Get the link
                </button>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`mt-3 text-sm ${message.includes('sent') || message.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                  <i className={`fas ${message.includes('sent') || message.includes('✓') ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                  <span className="inline-block">{message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Overlapping Images */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-[500px]">
              {/* Image 07 - Background Layer */}
              <div className="absolute left-0 top-0 w-3/5 h-full">
                <img
                  src="/07.png"
                  alt="App Download"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Image 09 - Foreground Layer (Overlapping on the right) */}
              <div className="absolute right-0 top-0 w-3/5 h-full">
                <img
                  src="/09.png"
                  alt="App Features"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Decorative Elements */}
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
