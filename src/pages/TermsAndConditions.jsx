import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-20 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Terms And Conditions</h1>
          <p className="text-gray-400 text-lg">Last Updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-2xl p-8 md:p-12 space-y-8 text-gray-300 leading-relaxed">
          
          <div className="bg-cyan-900/20 border-l-4 border-cyan-500 p-6 rounded">
            <p className="text-lg font-semibold text-white mb-2">Welcome to Ace2Examz</p>
            <p className="text-gray-300">
              Please read these Terms and Conditions carefully before using our website and services. By accessing or using Ace2Examz, you agree to be bound by these terms.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">
                <i className="fas fa-user-circle"></i>
              </span>
              Application and Account Details
            </h2>
            <div className="space-y-4">
              <p>
                If you use this publication and create an account, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
              </p>
              
              <div className="bg-pink-900/20 border-l-4 border-pink-500 p-4 rounded">
                <p className="text-pink-400 font-semibold mb-2">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Age Requirement
                </p>
                <p>If you are under 18, you may use only with involvement of a parent or guardian.</p>
              </div>

              <p>
                We reserve the right to refuse to supply any individual or company, to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.
              </p>

              <p>
                We may combine the information you give us with information from other companies and use it to improve and personalise our services, content and advertising. This may also be done on a reciprocal basis.
              </p>

              <p>
                From time to time, we make portions of our customer list available to carefully screened companies so that they can contact you with offers and information by mail, telephone, email or otherwise.
              </p>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm">
                  <strong className="text-cyan-400">Privacy Notice:</strong> If you do not want your name and mailing details made available, no longer want to receive a catalogue or wish to alert us to duplicate mailings, please call us on our helpline number or email us.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">
                <i className="fas fa-envelope"></i>
              </span>
              Mailing List
            </h2>
            <div className="space-y-4">
              <p>
                We may combine your information with information we collect from other companies and use it to improve and personalise our services, content and advertising. This may also be done on a reciprocal basis.
              </p>

              <p>
                From time to time, we make portions of our mailing list available to carefully screened companies.
              </p>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm">
                  <strong className="text-cyan-400">Opt-Out:</strong> If you do not want your name and mailing list made available or no longer choose to receive a catalogue or wish to alert us to duplicate mailings, please call us or email us.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">
                <i className="fas fa-shipping-fast"></i>
              </span>
              Delivery
            </h2>
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
              <p className="text-lg">
                <i className="fas fa-info-circle mr-2 text-cyan-400"></i>
                We don't have any physical products for delivery. All delivery against payment will be <strong className="text-white">online and real time</strong>.
              </p>
            </div>
          </div>

          {/* Additional Sections */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">
                <i className="fas fa-shield-alt"></i>
              </span>
              Limitation of Liability
            </h2>
            <p>
              Ace2Examz provides educational content and services on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">
                <i className="fas fa-edit"></i>
              </span>
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the website after changes are posted constitutes your acceptance of the modified terms.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 mt-8 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-white mb-3">
              <i className="fas fa-phone mr-2 text-cyan-400"></i>
              Questions About Terms?
            </h3>
            <p className="mb-4">If you have any questions or concerns about our Terms and Conditions, please contact us:</p>
            <div className="space-y-2 mb-4">
              <p>
                <i className="fas fa-envelope mr-2 text-cyan-400"></i>
                Email: <a href="mailto:crack@ace2examz.in" className="text-cyan-400 hover:text-cyan-300">crack@ace2examz.in</a>
              </p>
              <p>
                <i className="fas fa-phone mr-2 text-cyan-400"></i>
                Phone: <a href="tel:+919115179935" className="text-cyan-400 hover:text-cyan-300">+91-9115179935</a>
              </p>
              <p>
                <i className="fas fa-map-marker-alt mr-2 text-cyan-400"></i>
                Address: Chhota Tiwana Rd, Jalalabad West, Distt - Fazilka (PB), 152024
              </p>
            </div>
            <a href="mailto:crack@ace2examz.in" className="inline-block bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-cyan-400 transition">
              Contact Us
            </a>
          </div>

          {/* Acceptance */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-center text-gray-400 text-sm">
              By using Ace2Examz, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
