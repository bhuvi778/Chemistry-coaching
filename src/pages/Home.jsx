import { Link } from 'react-router-dom';
import CourseCard from '../components/UI/CourseCard';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import TeacherVideos from '../components/Home/TeacherVideos';
import Resources from '../components/Home/Resources';
import Testimonials from '../components/Home/Testimonials';
import AIComparison from '../components/Home/AIComparison';
import FAQ from '../components/Home/FAQ';
import { useData } from '../context/DataContext';

const Home = () => {
  const { courses, addEnquiry } = useData();
  const featuredCourses = courses.slice(0, 3);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addEnquiry({
      name: formData.get('name'),
      phone: formData.get('phone'),
      course: formData.get('course')
    });
    e.target.reset();
    alert('Thank you! We will call you back shortly.');
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-left z-10">
          <div className="inline-block px-4 py-1 mb-4 border border-cyan-400 rounded-full text-cyan-400 text-sm tracking-widest uppercase bg-cyan-900/30 backdrop-blur-sm">
            Admissions Open
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Chemistry for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">All Competitive Exams</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-lg">
            Specialized coaching for NEET, JEE, IAT, NEST, CSIR NET, GATE, IIT JAM & TIFR
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-lg">
            Join the #1 Chemistry Coaching Institute with our unique "Reaction Visualization" technique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/courses" className="px-8 py-4 rounded bg-cyan-500 text-black font-bold text-lg hover:shadow-[0_0_20px_#00f3ff] transition transform hover:scale-105 text-center">
              View Featured Batches
            </Link>
            <Link to="/ai-assistant" className="px-8 py-4 rounded border-2 border-cyan-400 text-cyan-400 font-bold text-lg hover:bg-cyan-400 hover:text-black transition text-center">
              <i className="fas fa-robot mr-2"></i>
              Try AI Assistant
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center items-center">
          <div className="relative w-64 h-64 glass-panel rounded-full flex items-center justify-center animate-pulse border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
            <i className="fas fa-atom text-9xl text-cyan-400 opacity-80"></i>
          </div>
          <div className="absolute top-0 right-10 p-3 glass-panel rounded-lg animate-bounce" style={{animationDuration: '3s'}}>
             <span className="text-pink-500 font-bold text-sm">JEE</span>
          </div>
          <div className="absolute bottom-0 left-10 p-3 glass-panel rounded-lg animate-bounce" style={{animationDuration: '4s'}}>
              <span className="text-cyan-400 font-bold text-sm">NEET</span>
          </div>
          <div className="absolute top-20 left-0 p-3 glass-panel rounded-lg animate-bounce" style={{animationDuration: '3.5s'}}>
              <span className="text-purple-400 font-bold text-sm">GATE</span>
          </div>
          <div className="absolute bottom-20 right-0 p-3 glass-panel rounded-lg animate-bounce" style={{animationDuration: '4.5s'}}>
              <span className="text-yellow-400 font-bold text-sm">CSIR NET</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Resources and Notes Section */}
      <Resources />

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Featured Batches</h2>
            <p className="text-gray-400">Most popular programs for the upcoming academic session.</p>
          </div>
          <Link to="/courses" className="mt-4 md:mt-0 px-6 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition font-bold flex items-center gap-2">
             Explore All Batches <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      {/* What Our Students Say Section */}
      <Testimonials />

      {/* Teacher Videos Section */}
      <TeacherVideos />

      {/* AI Comparison Section */}
      <AIComparison />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="glass-panel rounded-3xl overflow-hidden border border-gray-800 relative">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-900/20 blur-3xl -z-10"></div>

           <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 relative min-h-[400px]">
                 <img 
                    src="https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop" 
                    alt="Chemistry Lab" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-10">
                    <h3 className="text-4xl font-bold text-white mb-2">Still Confused?</h3>
                    <p className="text-cyan-400 text-lg mb-4">Let our experts guide you to the right path.</p>
                    <div className="flex items-center gap-4 text-gray-300">
                       <div className="flex -space-x-4">
                          <img className="w-10 h-10 rounded-full border-2 border-black" src="https://randomuser.me/api/portraits/men/1.jpg" alt=""/>
                          <img className="w-10 h-10 rounded-full border-2 border-black" src="https://randomuser.me/api/portraits/women/2.jpg" alt=""/>
                          <img className="w-10 h-10 rounded-full border-2 border-black" src="https://randomuser.me/api/portraits/men/3.jpg" alt=""/>
                       </div>
                       <span>500+ Students counseled this month</span>
                    </div>
                 </div>
              </div>

              <div className="lg:w-1/2 p-10 lg:p-16">
                 <form className="space-y-6" onSubmit={handleEnquirySubmit}>
                    <h3 className="text-2xl font-bold text-white mb-6">Request a Call Back</h3>
                    
                    <div className="relative group">
                       <input name="name" type="text" required className="w-full bg-gray-900/50 border-b-2 border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors peer" placeholder=" " />
                       <label className="absolute left-4 top-3 text-gray-500 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">Your Name</label>
                    </div>

                    <div className="relative group">
                       <input name="phone" type="tel" required className="w-full bg-gray-900/50 border-b-2 border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors peer" placeholder=" " />
                       <label className="absolute left-4 top-3 text-gray-500 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">Phone Number</label>
                    </div>

                    <div className="relative group">
                       <select name="course" className="w-full bg-gray-900/50 border-b-2 border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer">
                          <option className="bg-gray-900">Select Class / Course</option>
                          <option className="bg-gray-900">Class 11 (JEE/NEET)</option>
                          <option className="bg-gray-900">Class 12 (JEE/NEET)</option>
                          <option className="bg-gray-900">Dropper Batch</option>
                          <option className="bg-gray-900">Foundation (8-10)</option>
                       </select>
                       <i className="fas fa-chevron-down absolute right-4 top-4 text-gray-500 pointer-events-none"></i>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition transform hover:-translate-y-1">
                       Get Free Counseling
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;