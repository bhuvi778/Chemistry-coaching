import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Sharma",
      role: "JEE Aspirant",
      exam: "Class 12, Delhi",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "The WhatsApp community is amazing! Seniors and peers help clear doubts instantly. It feels like studying with 1000+ friends."
    },
    {
      id: 2,
      name: "Priya Verma",
      role: "NEET Student",
      exam: "Class 11, Mumbai",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "Weekly study groups and practice tests in the community keep me motivated. The peer support is incredible!"
    },
    {
      id: 3,
      name: "Rohan Patel",
      role: "Chemistry Enthusiast",
      exam: "Dropper, Pune",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "I love the daily chemistry facts and tricks shared in the community. Learning becomes fun when you're not alone!"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-cyan-900/10 to-transparent -z-10 blur-3xl"></div>

      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Experiences</span>
        </h2>
        <p className="text-gray-400 text-lg">Hear from students who are part of our vibrant learning community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {testimonials.map((student) => (
          <div key={student.id} className="relative group">
            {/* Decorative Elements */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

            <div className="relative glass-panel p-8 rounded-2xl h-full flex flex-col items-center text-center border-t border-white/10">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-cyan-400 to-pink-500">
                  <img src={student.image} alt={student.name} className="w-full h-full rounded-full object-cover border-4 border-gray-900" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <i className="fas fa-users"></i>
                  Active
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
              <p className="text-cyan-400 text-sm font-semibold mb-1">{student.role}</p>
              <p className="text-gray-500 text-xs mb-4">{student.exam}</p>

              <div className="relative">
                <i className="fas fa-quote-left text-4xl text-gray-700 absolute -top-4 -left-2 opacity-50"></i>
                <p className="text-gray-300 italic relative z-10 leading-relaxed">"{student.quote}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link to="/community">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition transform hover:scale-105 flex items-center gap-2 mx-auto">
            <i className="fab fa-whatsapp text-xl"></i>
            Join Our Community
            <i className="fas fa-arrow-right"></i>
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
