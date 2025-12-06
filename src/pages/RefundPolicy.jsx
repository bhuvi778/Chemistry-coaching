import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-8 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your satisfaction is our priority
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
          
          {/* Return Policy Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <FiCheckCircle className="text-cyan-600 dark:text-cyan-400" />
              Return Policy
            </h2>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                If for any reason you are dissatisfied with your online purchase, refunds are accepted within <strong className="text-pink-600 dark:text-pink-400">7 days of purchase</strong> only if you have not used the package or test series you have purchased.
              </p>

              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-r-lg my-6">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  📧 To process your refund, please send an email with your original receipt/transaction. Our customer service team will issue you a <strong>Return Authorization Number (RA number)</strong>.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 p-6 rounded-xl my-6">
                <div className="flex items-start gap-3">
                  <FiClock className="text-green-600 dark:text-green-400 text-2xl mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Refund Processing Time
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      If your refund request is approved, the amount will be credited to your account within <strong>7–10 working days</strong> through your original payment method.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg my-6">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Important:</strong> Returns should be sent by Secure Mail so they may be tracked.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <FiMail className="text-cyan-600 dark:text-cyan-400" />
              Questions?
            </h2>
            
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-cyan-200 dark:border-cyan-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions regarding our refund policy, please don't hesitate to contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiMail className="text-cyan-600 dark:text-cyan-400" />
                  <a 
                    href="mailto:crack@ace2examz.in" 
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                  >
                    crack@ace2examz.in
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <a 
                    href="tel:+919115179935" 
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                  >
                    +91-9115179935
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    Chhota Tiwana Rd, Jalalabad West,<br />
                    Distt - Fazilka (PB), 152024
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              This refund policy is effective as of the date of your purchase and applies to all courses and test series purchased through Ace2Examz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
