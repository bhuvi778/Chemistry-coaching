import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the batch size at Ace2examz?",
      answer: "We maintain a maximum batch size of 25 students to ensure personalized attention and effective doubt clearing. This allows our faculty to focus on each student's individual learning needs."
    },
    {
      question: "Do you provide study materials?",
      answer: "Yes! All enrolled students receive comprehensive study materials including chapter-wise notes, formula sheets, reaction mechanisms, DPPs (Daily Practice Papers), and access to our online video lecture library."
    },
    {
      question: "What is the fee structure?",
      answer: "Our fees vary based on the course and batch type. For Class 11-12 programs, fees range from ₹40,000 to ₹55,000 per year. We also offer flexible payment plans and scholarship opportunities for deserving students."
    },
    {
      question: "Is Ace2examz AI free to use?",
      answer: "Basic access to Ace2examz AI is free for all visitors. Enrolled students get premium access with unlimited questions, advanced explanations, and personalized study plans."
    },
    {
      question: "Do you offer online classes?",
      answer: "We offer a hybrid learning model. Students attend offline classes for interactive learning and get access to recorded video lectures for revision. Pure online batches are also available for outstation students."
    },
    {
      question: "What are the class timings?",
      answer: "We have flexible timings to accommodate different student schedules. Morning batches (9 AM - 1 PM), evening batches (4 PM - 7 PM), and weekend batches (Saturday-Sunday) are available."
    },
    {
      question: "How is the test series conducted?",
      answer: "We conduct weekly chapter tests, monthly full-syllabus tests, and All India Test Series (AITS) in exam-like conditions. Detailed performance analysis and rank predictions are provided after each test."
    },
    {
      question: "Can I get a demo class before enrolling?",
      answer: "Absolutely! We offer free demo classes for all our courses. You can attend a live class, meet our faculty, and experience our teaching methodology before making a decision."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Questions</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Got questions? We've got answers! Find everything you need to know about Ace2examz.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`glass-panel rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              openIndex === index ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'border-gray-700'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/30 transition"
            >
              <span className="text-lg font-bold text-white pr-8">{faq.question}</span>
              <div className={`w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}>
                <i className="fas fa-chevron-down text-cyan-400"></i>
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}>
              <div className="px-6 pb-5 pt-2 border-t border-gray-700">
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center glass-panel p-8 rounded-2xl border border-cyan-400/30">
        <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
        <p className="text-gray-400 mb-6">Our counseling team is here to help you with any queries.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:+919876543210" 
            className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition inline-flex items-center justify-center"
          >
            <i className="fas fa-phone mr-2"></i>
            Call Now
          </a>
          <a 
            href="https://wa.me/919876543210?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Reaction%20Lab%20courses" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition inline-flex items-center justify-center"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
