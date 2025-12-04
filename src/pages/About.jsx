import React, { useState } from 'react';

const About = () => {
  const [showAllStories, setShowAllStories] = useState(false);

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
      quote: "Reaction Lab's test series is the closest thing to the actual exam. The analysis helped me improve my speed.",
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
      quote: "Coming from a small town, I thought cracking IIT was impossible. Reaction Lab proved me wrong.",
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
      quote: "Reaction Lab's NCERT mastery sessions are gold. Every single line from NCERT was covered in detail.",
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
      quote: "Chemistry was my weakest subject. Now it's my strongest, all thanks to Reaction Lab!",
      year: "2020"
    }
  ];

  const displayedStories = showAllStories ? successStories : successStories.slice(0, 6);

  return (
    <div className="animate-fadeIn">
       <div className="max-w-5xl mx-auto px-4 py-20">
            {/* Our Story Section */}
            <div className="mb-24 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <h1 className="text-5xl font-bold mb-6 text-white">Forging <span className="text-cyan-400">Futures</span> Since 2015</h1>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Reaction Lab started as a small doubt-clearing cell in a garage. Today, it stands as a beacon of excellence in chemistry education. Our journey began with a simple observation: students were memorizing reactions without understanding the underlying mechanisms.
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
                                <div className="text-3xl font-bold text-cyan-400 mb-1">150+</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">IITians</div>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Doctors</div>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-green-400 mb-1">98%</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Success Rate</div>
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

            <h3 className="text-3xl font-bold text-center mb-10">Meet Your Mentors (HODs)</h3>
            <div className="flex flex-wrap justify-center gap-8 mb-24">
                <div className="text-center group">
                    <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">SB</span>
                    </div>
                    <h4 className="text-xl font-bold">Dr. Sarah Bond</h4>
                    <p className="text-cyan-400 text-sm">HOD Organic Chemistry</p>
                    <p className="text-gray-500 text-xs mt-1">Ex-IIT Faculty, 15 Yrs Exp</p>
                </div>
                <div className="text-center group">
                     <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 bg-gradient-to-bl group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">JI</span>
                    </div>
                    <h4 className="text-xl font-bold">Mr. James Ion</h4>
                    <p className="text-cyan-400 text-sm">HOD Physical Chemistry</p>
                     <p className="text-gray-500 text-xs mt-1">B.Tech IIT Delhi, 12 Yrs Exp</p>
                </div>
                 <div className="text-center group">
                     <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">ER</span>
                    </div>
                    <h4 className="text-xl font-bold">Ms. Elena Ray</h4>
                    <p className="text-cyan-400 text-sm">HOD Inorganic Chemistry</p>
                     <p className="text-gray-500 text-xs mt-1">M.Sc Chemistry, Gold Medalist</p>
                </div>
            </div>

            {/* Success Stories Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-4">
                  Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Fame</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                  Our students don't just crack exams - they dominate them. Read their inspiring journeys from aspiring students to top rankers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedStories.map((story) => (
                  <div key={story.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                    
                    <div className="relative glass-panel p-6 rounded-2xl h-full flex flex-col border-t border-white/10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-cyan-400 to-pink-500">
                            <img src={story.image} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-gray-900" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                            {story.rank}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-white">{story.name}</h3>
                          <p className="text-cyan-400 text-sm font-semibold">{story.exam}</p>
                          <p className="text-gray-400 text-xs mt-1">{story.college}</p>
                        </div>
                      </div>
                      
                      <div className="relative flex-grow">
                        <i className="fas fa-quote-left text-2xl text-gray-700 absolute -top-2 -left-1 opacity-50"></i>
                        <p className="text-gray-300 text-sm italic relative z-10 leading-relaxed pl-6">
                          "{story.quote}"
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Batch of {story.year}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {successStories.length > 6 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAllStories(!showAllStories)}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition transform hover:scale-105"
                  >
                    {showAllStories ? (
                      <>
                        <i className="fas fa-chevron-up mr-2"></i>
                        Show Less
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down mr-2"></i>
                        View All {successStories.length} Success Stories
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
        </div>
    </div>
  );
};

export default About;