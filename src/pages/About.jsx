import React from 'react';

const About = () => {

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Bond",
      rank: "HOD Organic Chemistry",
      exam: "Ex-IIT Faculty",
      college: "PhD in Organic Chemistry - IIT Delhi",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "I believe in making chemistry visual and tangible. Every reaction tells a story, and my goal is to help students see that story unfold.",
      year: "15 Yrs Exp"
    },
    {
      id: 2,
      name: "Mr. James Ion",
      rank: "HOD Physical Chemistry",
      exam: "B.Tech IIT Delhi",
      college: "M.Tech Chemical Engineering - IIT Bombay",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "Physical Chemistry is not about formulas - it's about understanding the 'why' behind every concept. Once you get that, everything clicks.",
      year: "12 Yrs Exp"
    },
    {
      id: 3,
      name: "Ms. Elena Ray",
      rank: "HOD Inorganic Chemistry",
      exam: "M.Sc Chemistry, Gold Medalist",
      college: "Specialization in Coordination Chemistry",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "Inorganic chemistry is like solving a puzzle. Every element has its personality, and learning to predict their behavior is the key to mastery.",
      year: "10 Yrs Exp"
    }
  ];

  const successStories = [
    {
      id: 1,
      name: "Aarav Patel",
      rank: "AIR 45",
      exam: "JEE Advanced 2023",
      college: "IIT Bombay - Computer Science",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "The visualization techniques changed how I saw Organic Chemistry. It wasn't just memorizing reactions anymore.",
      year: "2023"
    },
    {
      id: 2,
      name: "Sneha Gupta",
      rank: "AIR 12",
      exam: "NEET UG 2023",
      college: "AIIMS Delhi",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "Ace2examz's test series is the closest thing to the actual exam. The analysis helped me improve my speed.",
      year: "2023"
    },
    {
      id: 3,
      name: "Rohan Kumar",
      rank: "AIR 108",
      exam: "JEE Main 2023",
      college: "IIT Delhi - Mechanical",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "Personal mentorship from HODs helped me overcome my weak topics in Physical Chemistry.",
      year: "2023"
    },
    {
      id: 4,
      name: "Priya Sharma",
      rank: "AIR 234",
      exam: "NEET UG 2023",
      college: "JIPMER Puducherry",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The daily practice papers kept me consistent. I never missed a single DPP and it paid off!",
      year: "2023"
    },
    {
      id: 5,
      name: "Arjun Mehta",
      rank: "AIR 567",
      exam: "JEE Advanced 2022",
      college: "IIT Kharagpur - Chemical",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "Coming from a small town, I thought cracking IIT was impossible. Ace2examz proved me wrong.",
      year: "2022"
    },
    {
      id: 6,
      name: "Ananya Singh",
      rank: "AIR 89",
      exam: "NEET UG 2022",
      college: "AIIMS Jodhpur",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "The faculty's dedication is unmatched. They stayed back after classes to clear my doubts every single day.",
      year: "2022"
    },
    {
      id: 7,
      name: "Karthik Reddy",
      rank: "AIR 1234",
      exam: "JEE Main 2022",
      college: "NIT Trichy - Electronics",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      quote: "The hybrid model was perfect for me. I could balance my board prep and JEE simultaneously.",
      year: "2022"
    },
    {
      id: 8,
      name: "Divya Iyer",
      rank: "AIR 456",
      exam: "NEET UG 2021",
      college: "CMC Vellore",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      quote: "Ace2examz's NCERT mastery sessions are gold. Every single line from NCERT was covered in detail.",
      year: "2021"
    },
    {
      id: 9,
      name: "Vedant Joshi",
      rank: "AIR 789",
      exam: "JEE Advanced 2021",
      college: "IIT Madras - Aerospace",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      quote: "The All India Test Series gave me a reality check. I knew exactly where I stood among lakhs of students.",
      year: "2021"
    },
    {
      id: 10,
      name: "Ishita Agarwal",
      rank: "AIR 321",
      exam: "NEET UG 2021",
      college: "Maulana Azad Medical College",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "Being a dropper was tough mentally. The counseling and support I got here was invaluable.",
      year: "2021"
    },
    {
      id: 11,
      name: "Aditya Kapoor",
      rank: "AIR 2345",
      exam: "JEE Main 2020",
      college: "DTU Delhi - Software",
      image: "https://randomuser.me/api/portraits/men/71.jpg",
      quote: "The small batch size meant the teachers knew my strengths and weaknesses personally.",
      year: "2020"
    },
    {
      id: 12,
      name: "Tanvi Desai",
      rank: "AIR 678",
      exam: "NEET UG 2020",
      college: "GMC Mumbai",
      image: "https://randomuser.me/api/portraits/women/78.jpg",
      quote: "Chemistry was my weakest subject. Now it's my strongest, all thanks to Ace2examz!",
      year: "2020"
    }
  ];



  return (
    <div className="animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Our Story Section */}
        <div className="mb-24 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold mb-6 text-white">Forging <span className="text-cyan-400">Futures</span> Since 2010</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Ace2examz started as a small doubt-clearing cell in a garage. Today, it stands as a beacon of excellence in chemistry education. Our journey began with a simple observation: students were memorizing reactions without understanding the underlying mechanisms.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We set out to change that. By combining traditional teaching with modern visualization tools, we've helped over 5,000 students crack JEE and NEET with top ranks. We don't just prepare you for exams; we prepare you to think like a scientist.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative glass-panel p-8 rounded-2xl border border-gray-700">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-pink-500 mb-1">5k+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Alumni</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">140+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">IITians</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">240+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Doctors</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-green-400 mb-1">4.8 (460)</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Ratings, garage replace rooms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">The Teaching Methodology</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">We believe chemistry isn't just memorization. It's understanding the building blocks of the universe through logic and visualization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Why We Produce Toppers</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                <span><strong>Hybrid Learning:</strong> Missed a class? Watch the recording on our app.</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                <span><strong>Rigorous Testing:</strong> Weekly Mains and Advanced pattern tests.</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                <span><strong>Small Batch Size:</strong> Max 30 students per batch for personal attention.</span>
              </li>
            </ul>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <i className="fas fa-chalkboard-teacher text-9xl text-gray-700 opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Infrastructure Section */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-center mb-12">State-of-the-Art Infrastructure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-400 mb-4 text-2xl">
                <i className="fas fa-book-reader"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Smart Library</h4>
              <p className="text-gray-400 text-sm">24/7 access to thousands of reference books and quiet study zones.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-pink-900/30 rounded-full flex items-center justify-center text-pink-400 mb-4 text-2xl">
                <i className="fas fa-flask"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Practical Labs</h4>
              <p className="text-gray-400 text-sm">Real chemical labs for practical demonstration of theoretical concepts.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mb-4 text-2xl">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">CBT Center</h4>
              <p className="text-gray-400 text-sm">Computer Based Test center to simulate the actual JEE/NEET exam environment.</p>
            </div>
          </div>
        </div>

        {/* Meet Your Mentors Section */}
        <div className="mb-24">
          <div className="glass-panel rounded-3xl border border-cyan-500/20 p-12 md:p-16 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content Side */}
              <div className="lg:w-1/2 space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                  <i className="fas fa-shield-alt text-cyan-400 text-sm"></i>
                  <span className="text-cyan-400 text-sm font-semibold">Trusted by 100K+ parents just like you</span>
                </div>

                {/* Main Heading */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Making Chemistry</span>
                  </h2>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Joyful & Simple <i className="fas fa-flask text-cyan-400 text-3xl ml-2"></i>
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">
                  From confused learners to exam toppers — get expert chemistry coaching,{' '}
                  <span className="text-cyan-400 font-semibold">tested teaching methods</span>, and results that actually work for busy parents raising happy, successful students.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl transition transform hover:scale-105 shadow-lg">
                    <i className="fas fa-user-graduate mr-2"></i>
                    Ask a Chemistry Expert
                  </button>
                  <button className="px-6 py-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-bold rounded-xl border border-pink-500/30 transition">
                    <i className="fab fa-instagram mr-2"></i>
                    Follow @ace2examz
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <i className="fas fa-users text-cyan-400 text-xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">100K+</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Alumini</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <i className="fas fa-flask text-pink-400 text-xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">5000+</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <i className="fas fa-star text-yellow-400 text-xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">15+</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Years of Experience</div>
                  </div>
                </div>
              </div>

              {/* Right Image Side */}
              <div className="lg:w-1/2 relative">
                <div className="relative group">
                  {/* Border Frame */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  {/* Image Container */}
                  <div className="relative rounded-3xl overflow-hidden border-4 border-cyan-500/30 shadow-2xl">
                    <img 
                      src="/navein-kumar-educator.jpg" 
                      alt="Navein Kumar - Chemistry Educator" 
                      className="w-full h-[500px] object-cover"
                    />
                    
                    {/* Top Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-shield-alt text-green-500"></i>
                        <span className="text-gray-800 text-sm font-semibold">Certified Professional</span>
                      </div>
                    </div>

                    {/* Bottom Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <div className="text-white font-bold">Navein Kumaar</div>
                          <div className="text-cyan-400 text-sm">EDUCATOR</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 opacity-50">
                    <i className="fas fa-atom text-cyan-400 text-6xl animate-spin-slow"></i>
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 opacity-50">
                    <i className="fas fa-flask text-pink-400 text-5xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Section */}
        <div className="mb-24">

          {/* Success Stories Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">
                Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Fame</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Our students don't just crack exams - they dominate them. Read their inspiring journeys from aspiring students to top rankers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories.slice(0, 6).map((story) => (
                <div key={story.id} className="glass-panel rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all duration-300 group">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/50" />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-1">{story.name}</h3>
                      <p className="text-cyan-400 text-sm font-semibold">{story.rank}</p>
                      <p className="text-gray-400 text-xs">{story.exam}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm italic">"{story.quote}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <span className="text-xs text-gray-400">
                      <i className="fas fa-graduation-cap text-pink-500 mr-1"></i>
                      {story.college.split('-')[0].trim()}
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold">Batch {story.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;