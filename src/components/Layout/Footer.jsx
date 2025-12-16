import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <footer className="relative mt-auto border-t border-gray-800 bg-black/40 backdrop-blur-xl">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img
                                src={isDark ? "/logo-light.png" : "/logo-dark.png"}
                                alt="Ace2Examz - Your Path To Success"
                                className="h-12 w-auto object-contain transition-opacity duration-300"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed justify-center">
                            Ace2Examz is a dedicated Chemistry platform offering concept mastery, problem solving, and smart practice through videos and MCQs -designed by an expert for serious exam aspirants to succeed confidently.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/ace2examz" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-black transition-all duration-300">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/ace2examz/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.youtube.com/@ace2examz" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href="https://x.com/ace2examz" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-black transition-all duration-300">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://t.me/ace2examz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-300">
                                <i className="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-pink-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> Home</Link></li>
                            <li><Link to="/about" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> About Us</Link></li>
                            <li><Link to="/courses" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> All Courses</Link></li>
                            <li><Link to="/lectures" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fab fa-youtube text-xs text-red-500"></i> Video Lectures</Link></li>
                            <li><Link to="/ai-assistant" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-robot text-xs text-cyan-400"></i> Ask AI Assistant</Link></li>
                            <li><Link to="/contact" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Resources & Programs */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Resources
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/study-materials" className="hover:text-pink-400 transition flex items-center gap-2"><i className="fas fa-file-alt text-xs"></i> Study Notes</Link></li>
                            <li><Link to="/courses" className="hover:text-pink-400 transition flex items-center gap-2"><i className="fas fa-pen text-xs"></i> Practice Materials</Link></li>
                            <li><Link to="/lectures" className="hover:text-pink-400 transition flex items-center gap-2"><i className="fas fa-play-circle text-xs"></i> Video Lectures</Link></li>
                            <li><Link to="/courses" className="hover:text-pink-400 transition flex items-center gap-2"><i className="fas fa-clipboard-check text-xs"></i> Test Series</Link></li>
                            <li><Link to="/courses" className="hover:text-pink-400 transition flex items-center gap-2"><i className="fas fa-book-open text-xs"></i> Solved Examples</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Get In Touch
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
                        </h4>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 text-gray-400 text-sm">
                                <i className="fas fa-map-marker-alt mt-1 text-cyan-400"></i>
                                <span>Chhota Tiwana Rd, Jalalabad West, Distt - Fazilka (PB), 152024</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <i className="fas fa-phone text-cyan-400"></i>
                                <a href="tel:+919876543210" className="hover:text-white transition">+91 9115179935</a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <i className="fas fa-envelope text-cyan-400"></i>
                                <a href="mailto:info@ace2examz.com" className="hover:text-white transition">crack@ace2examz.in</a>
                            </div>
                        </div>

                        {/* Zoho Campaigns Newsletter */}
                        <div
                            id="sf3z9a6c989be977e55a4b7314f1064d24923d8081c2d7b577011b09adb8de5640f9"
                            data-type="signupform"
                            className="zoho-newsletter-wrapper"
                        >
                            <div id="customForm">
                                <div
                                    className="quick_form_9_css"
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: '100%',
                                        maxWidth: '350px',
                                        border: 'none',
                                        fontFamily: 'Arial'
                                    }}
                                    name="SIGNUP_BODY"
                                >
                                    <div>
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                fontFamily: 'Arial',
                                                fontWeight: 'bold',
                                                color: '#9CA3AF',
                                                textAlign: 'left',
                                                paddingBottom: '10px',
                                                width: '100%',
                                                display: 'block'
                                            }}
                                            id="SIGNUP_HEADING"
                                        >
                                            Subscribe to our newsletter:
                                        </span>

                                        <div style={{ position: 'relative' }}>
                                            <div
                                                id="Zc_SignupSuccess"
                                                style={{
                                                    display: 'none',
                                                    position: 'absolute',
                                                    marginLeft: '4%',
                                                    width: '90%',
                                                    backgroundColor: '#10B981',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    marginTop: '10px',
                                                    marginBottom: '10px',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                <span
                                                    id="signupSuccessMsg"
                                                    style={{
                                                        color: 'white',
                                                        fontFamily: 'sans-serif',
                                                        fontSize: '14px',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    ✓ Thank you for Signing Up!
                                                </span>
                                            </div>
                                        </div>

                                        <form
                                            method="POST"
                                            id="zcampaignOptinForm"
                                            style={{ margin: 0, width: '100%', padding: 0 }}
                                            action="https://exmz-zc1.maillist-manage.in/weboptin.zc"
                                            target="_zcSignup"
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: '#FEE2E2',
                                                    padding: '10px',
                                                    color: '#DC2626',
                                                    fontSize: '11px',
                                                    margin: '10px 0',
                                                    borderRadius: '8px',
                                                    opacity: 1,
                                                    display: 'none'
                                                }}
                                                id="errorMsgDiv"
                                            >
                                                Please correct the marked field(s) below.
                                            </div>

                                            <div className="relative flex gap-2">
                                                <input
                                                    type="text"
                                                    style={{
                                                        fontSize: '14px',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px',
                                                        width: '100%',
                                                        height: '40px',
                                                        outline: 'none',
                                                        padding: '5px 12px',
                                                        color: '#D1D5DB',
                                                        backgroundColor: '#1F2937',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Enter your email"
                                                    name="CONTACT_EMAIL"
                                                    id="EMBED_FORM_EMAIL_LABEL"
                                                />
                                                <input
                                                    type="submit"
                                                    style={{
                                                        textAlign: 'center',
                                                        width: '90px',
                                                        height: '40px',
                                                        border: 0,
                                                        color: '#000',
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#06B6D4',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    name="SIGNUP_SUBMIT_BUTTON"
                                                    id="zcWebOptin"
                                                    value="JOIN"
                                                    className="hover:bg-cyan-400"
                                                />
                                            </div>

                                            <input type="hidden" id="fieldBorder" value="" />
                                            <input type="hidden" id="submitType" name="submitType" value="optinCustomView" />
                                            <input type="hidden" id="emailReportId" name="emailReportId" value="" />
                                            <input type="hidden" id="formType" name="formType" value="QuickForm" />
                                            <input type="hidden" name="zx" id="cmpZuid" value="1dfb57f5b3" />
                                            <input type="hidden" name="zcvers" value="2.0" />
                                            <input type="hidden" name="oldListIds" id="allCheckedListIds" value="" />
                                            <input type="hidden" id="mode" name="mode" value="OptinCreateView" />
                                            <input type="hidden" id="zcld" name="zcld" value="" />
                                            <input type="hidden" id="zctd" name="zctd" value="141ac10fff6a5e31" />
                                            <input type="hidden" id="document_domain" value="" />
                                            <input type="hidden" id="zc_Url" value="exmz-zc1.maillist-manage.in" />
                                            <input type="hidden" id="new_optin_response_in" value="0" />
                                            <input type="hidden" id="duplicate_optin_response_in" value="0" />
                                            <input type="hidden" name="zc_trackCode" id="zc_trackCode" value="ZCFORMVIEW" />
                                            <input type="hidden" id="zc_formIx" name="zc_formIx" value="3z9a6c989be977e55a4b7314f1064d24923d8081c2d7b577011b09adb8de5640f9" />
                                            <input type="hidden" id="viewFrom" value="URL_ACTION" />
                                            <span style={{ display: 'none' }} id="dt_CONTACT_EMAIL">1,true,6,Contact Email,2</span>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-black/60">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <p>&copy; 2025 Ace2Examz (Keystone Academy Connect (OPC) Pvt Ltd)</p>
                        <div className="flex gap-6">
                            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
                            <Link to="/terms-and-conditions" className="hover:text-white transition">Terms of Service</Link>
                            <Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
                            <Link to="/admin" className="hover:text-cyan-400 transition">Admin Login</Link>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-xs text-gray-600">
                        <p>Made with <i className="fas fa-heart text-red-500 mx-1"></i> for aspiring chemistry aspirants | Catalyzing dreams since 2010</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;