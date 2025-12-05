import { useState } from 'react';
import { useData } from '../context/DataContext';

const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const { addContact } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      exam: formData.get('exam')
    };

    setTimeout(() => {
      addContact(data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Admission Enquiry</h2>
        <p className="text-gray-400">Visit our center or fill the form below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl flex items-center">
              <div className="w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center text-cyan-400 mr-4">
                  <i className="fas fa-envelope"></i>
              </div>
              <div>
                  <h4 className="font-bold text-lg">Admissions Email</h4>
                  <p className="text-gray-400">admissions@ace2examz.com</p>
              </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center">
              <div className="w-12 h-12 bg-pink-900 rounded-full flex items-center justify-center text-pink-400 mr-4">
                  <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                  <h4 className="font-bold text-lg">Offline Center</h4>
                  <p className="text-gray-400">2nd Floor, Kota House, Edu-City</p>
              </div>
          </div>
           <div className="glass-panel p-8 rounded-xl mt-8">
                <h4 className="font-bold mb-4">Counseling Hours</h4>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Mon - Sat</span>
                    <span>09:00 AM - 07:00 PM</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Sunday</span>
                    <span>10:00 AM - 02:00 PM</span>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-cyan-400">Student Name</label>
            <input name="name" type="text" required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-cyan-400 transition" placeholder="Enter Full Name" />
          </div>
           <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-cyan-400">Phone Number</label>
            <input name="phone" type="tel" required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-cyan-400 transition" placeholder="+91 XXXXX XXXXX" />
          </div>
           <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-cyan-400">Target Exam</label>
            <select name="exam" className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-cyan-400 transition">
                <option>JEE (Main + Advanced)</option>
                <option>NEET (Medical)</option>
                <option>Board Exams (11th/12th)</option>
                <option>Foundation (8th-10th)</option>
            </select>
           </div>
          
          <button type="submit" disabled={status !== 'idle'} className={`w-full font-bold py-3 rounded transition ${
            status === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105'
          }`}>
            {status === 'idle' && 'Request Call Back'}
            {status === 'submitting' && <span><i className="fas fa-spinner fa-spin"></i> Sending...</span>}
            {status === 'success' && <span><i className="fas fa-check"></i> Sent!</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;