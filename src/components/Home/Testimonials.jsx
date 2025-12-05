import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Patel",
      rank: "AIR 45",
      exam: "JEE Advanced 2023",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "The visualization techniques changed how I saw Organic Chemistry. It wasn't just memorizing reactions anymore."
    },
    {
      id: 2,
      name: "Sneha Gupta",
      rank: "AIR 12",
      exam: "NEET UG 2023",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "Ace2examz's test series is the closest thing to the actual exam. The analysis helped me improve my speed."
    },
    {
      id: 3,
      name: "Rohan Kumar",
      rank: "AIR 108",
      exam: "JEE Main 2023",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "Personal mentorship from HODs helped me overcome my weak topics in Physical Chemistry."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-cyan-900/10 to-transparent -z-10 blur-3xl"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Students Say</span>
        </h2>
        <p className="text-gray-400 text-lg">Celebrating students who catalyzed their potential into success</p>
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
                <div className="absolute -bottom-3 -right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {student.rank}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
              <p className="text-cyan-400 text-sm font-bold mb-4">{student.exam}</p>
              
              <div className="relative">
                <i className="fas fa-quote-left text-4xl text-gray-700 absolute -top-4 -left-2 opacity-50"></i>
                <p className="text-gray-300 italic relative z-10 leading-relaxed">"{student.quote}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link to="/about">
          <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400 hover:text-black transition">
            Read More Success Stories
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
