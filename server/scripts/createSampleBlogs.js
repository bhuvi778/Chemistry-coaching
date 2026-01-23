const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('../models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chemistry_coaching';

const sampleBlogs = [
  {
    title: 'How to complete Class 12 Biology syllabus in 2 months?',
    slug: 'how-to-complete-class-12-biology-syllabus-in-2-months',
    author: 'JEE',
    excerpt: 'Two months is a challenging but achievable timeframe to cover the entire Class 12 Biology syllabus effectively. Let\'s break down a strategic approach to help you master the subject and aim for top results.',
    content: `
      <h2>Completing Your Class 12 Biology Syllabus in 2 Months</h2>
      <p>Hello students! As your dedicated Biology teacher, I understand the pressure of completing a vast syllabus in a limited time, especially when facing board exams. Two months is a challenging but achievable timeframe to cover the entire Class 12 Biology syllabus effectively. Let's break down a strategic approach to help you master the subject and aim for top results.</p>

      <h2>Your 2-Month Biology Study Plan</h2>
      <p>The key is to be disciplined, consistent, and strategic in your approach. We will divide the two months into dedicated phases for learning, practice, and revision.</p>

      <h3>Month 1: Comprehensive Coverage and Concept Clarity</h3>
      <p>This month is crucial for understanding the core concepts and ensuring you cover all topics from your NCERT textbook. Remember, NCERT is your bible for board exams.</p>

      <ul>
        <li><strong>Prioritize and Pace:</strong> Divide the syllabus into manageable units. Aim to cover approximately 2-3 chapters per week, depending on their complexity.</li>
        <li><strong>Active Reading of NCERT:</strong> Read each chapter thoroughly. Highlight key terms, definitions, and processes. Pay close attention to the diagrams provided in the NCERT book.</li>
        <li><strong>Diagram Mastery:</strong> Focus heavily on diagrams. They are frequently asked in exams. Understand what each part represents and its function. For instance, mastering diagrams from "Sexual Reproduction in Flowering Plants" is critical, including the transverse section of an anther and an anatropous ovule.</li>
        <li><strong>Conceptual Understanding:</strong> Don't just memorize. Understand the "why" behind biological processes. For example, grasp the mechanisms of microsporogenesis and embryo sac development.</li>
        <li><strong>Make Notes:</strong> Create your own concise notes, especially for complex topics. Include flowcharts, tables, and mind maps to aid revision.</li>
        <li><strong>Abbreviation Practice:</strong> Familiarize yourself with all essential abbreviations. Resources like the "All Abbreviations | NCERT | Biology 12th" video by Sourabh Raina can be very helpful for quick revision.</li>
      </ul>

      <h3>Month 2: Intensive Practice, Revision, and Mock Tests</h3>
      <p>This month is dedicated to reinforcing your learning through practice and identifying areas for improvement.</p>

      <ul>
        <li><strong>Previous Year Questions (PYQs):</strong> Solve as many PYQs as possible. This will give you insights into the exam pattern, marking scheme, and frequently asked topics. Videos like "150+ MCQ | Class 12 Biology | CBSE Board | 2025" by Sourabh Raina can help you practice and understand recurring question types.</li>
        <li><strong>MCQ Practice:</strong> Regularly solve Multiple Choice Questions to build speed and accuracy.</li>
        <li><strong>Diagram-Based Questions:</strong> Practice questions that require you to identify parts of a given diagram or draw and label specific structures.</li>
        <li><strong>Full Syllabus Revision:</strong> Dedicate specific days for revising the entire syllabus. Use your notes, flowcharts, and mind maps.</li>
        <li><strong>Mock Tests:</strong> Take at least 3-4 full-syllabus mock tests under timed conditions. This is crucial for improving your time management skills and getting accustomed to the exam environment.</li>
        <li><strong>Analyze Mistakes:</strong> After each mock test, thoroughly analyze your errors. Understand why you made a mistake and revise the relevant topic accordingly.</li>
      </ul>

      <h3>Teacher's Tip</h3>
      <p>For Biology, ensure your answers are precise, well-structured, and use correct biological terminology. When drawing diagrams, label all parts clearly and accurately. For topics like Human Reproduction or Biotechnology, focus on understanding the processes and applications.</p>

      <h3>Recommended Resources</h3>
      <p>To support your preparation, I highly recommend the following resources:</p>

      <ul>
        <li><strong>NCERT Textbook:</strong> Your primary resource.</li>
        <li><strong>PYQ Compilations:</strong> Books or online resources that compile previous years' questions.</li>
        <li><strong>Your Own Notes:</strong> Summaries and flowcharts you create.</li>
      </ul>

      <p>Remember, two months require dedication and a smart study plan. Stay focused, believe in your ability, and you will surely achieve your goals. I am here to support you in your journey!</p>
    `,
    category: 'Boards',
    tags: ['Class 12', 'Biology', 'Board Exams', 'Study Plan', 'NCERT'],
    isPublished: true,
    publishedDate: new Date('2024-11-07'),
    views: 332,
    metaTitle: 'Complete Class 12 Biology in 2 Months - Expert Study Plan',
    metaDescription: 'Learn how to effectively complete your Class 12 Biology syllabus in just 2 months with this comprehensive study plan from expert teachers.',
    metaKeywords: ['Class 12 Biology', 'Board Exam Preparation', 'Study Plan', 'NCERT Biology']
  },
  {
    title: 'What are high-paying careers after BSc in Chemistry or Biology?',
    slug: 'high-paying-careers-after-bsc-chemistry-biology',
    author: 'JEE',
    excerpt: 'Completing a BSc in Chemistry or Biology opens doors to numerous high-paying and fulfilling career paths. Let\'s explore some of the best options available.',
    content: `
      <h2>High-Paying Careers After BSc in Chemistry or Biology</h2>
      <p>Completing a BSc in Chemistry or Biology opens doors to numerous high-paying and fulfilling career paths. The key is to identify your interests and pursue relevant specializations or certifications.</p>

      <h3>Top Career Options After BSc Chemistry</h3>
      <ul>
        <li><strong>Pharmaceutical Industry:</strong> Work as a research scientist, quality control analyst, or production manager in pharmaceutical companies. Salaries range from ₹3-8 lakhs per annum for freshers.</li>
        <li><strong>Chemical Engineering:</strong> Pursue an M.Tech or work in chemical plants, refineries, and manufacturing units. Senior positions can earn ₹10-20 lakhs annually.</li>
        <li><strong>Research Scientist:</strong> Join research institutions like CSIR, DRDO, or private R&D labs. With experience, salaries can reach ₹8-15 lakhs per annum.</li>
        <li><strong>Forensic Science:</strong> Work with law enforcement agencies as a forensic analyst. Government positions offer stable income and benefits.</li>
        <li><strong>Teaching and Academia:</strong> Become a lecturer or professor after completing MSc and NET/SET. Senior professors earn ₹8-12 lakhs annually.</li>
      </ul>

      <h3>Top Career Options After BSc Biology</h3>
      <ul>
        <li><strong>Medical Field:</strong> Pursue MBBS, BDS, or allied health sciences. Doctors can earn ₹10-50 lakhs+ depending on specialization.</li>
        <li><strong>Biotechnology:</strong> Work in biotech firms, research labs, or pharmaceutical companies. Experienced professionals earn ₹6-15 lakhs annually.</li>
        <li><strong>Environmental Science:</strong> Join environmental consultancies, NGOs, or government agencies. Salaries range from ₹4-10 lakhs per annum.</li>
        <li><strong>Clinical Research:</strong> Work as a clinical research associate or coordinator. CRAs can earn ₹5-12 lakhs annually.</li>
        <li><strong>Nutrition and Dietetics:</strong> Become a certified nutritionist or dietitian. Private practice can be very lucrative.</li>
      </ul>

      <h3>Additional Certifications That Boost Salary</h3>
      <ul>
        <li>Data Science and Analytics</li>
        <li>Quality Management (Six Sigma, ISO)</li>
        <li>Project Management (PMP)</li>
        <li>Regulatory Affairs</li>
        <li>Patent Law</li>
      </ul>

      <p><strong>Pro Tip:</strong> Combining your science background with business, management, or technology skills can significantly increase your earning potential. Consider pursuing an MBA, learning programming, or getting certified in emerging fields like bioinformatics or computational chemistry.</p>
    `,
    category: 'Career Guidance',
    tags: ['BSc', 'Chemistry', 'Biology', 'Career Options', 'High Paying Jobs'],
    isPublished: true,
    publishedDate: new Date('2024-11-08'),
    views: 395,
    metaTitle: 'High-Paying Careers After BSc Chemistry or Biology',
    metaDescription: 'Discover lucrative career options after completing BSc in Chemistry or Biology, including pharmaceutical, research, and medical fields.',
    metaKeywords: ['BSc Careers', 'Chemistry Jobs', 'Biology Careers', 'High Paying Jobs']
  },
  {
    title: 'How to revise the full syllabus one week before the board exam?',
    slug: 'revise-full-syllabus-one-week-before-board-exam',
    author: 'JEE',
    excerpt: 'The final week before your board exam is crucial. Here\'s a strategic approach to revise the entire syllabus effectively in just seven days.',
    content: `
      <h2>Last Week Revision Strategy for Board Exams</h2>
      <p>The final week before your board exam is crucial. This is not the time to learn new concepts but to consolidate what you've already studied. Here's a strategic approach to revise the entire syllabus effectively.</p>

      <h3>Day-wise Revision Plan</h3>
      
      <h4>Days 1-2: High-Weightage Topics</h4>
      <ul>
        <li>Focus on chapters with maximum marks</li>
        <li>Revise important formulas, definitions, and diagrams</li>
        <li>Solve previous year questions from these chapters</li>
        <li>Make quick reference notes or flashcards</li>
      </ul>

      <h4>Days 3-4: Medium-Weightage Topics</h4>
      <ul>
        <li>Cover moderately important chapters</li>
        <li>Focus on frequently asked questions</li>
        <li>Practice numerical problems (for Physics/Chemistry)</li>
        <li>Revise key concepts and applications</li>
      </ul>

      <h4>Days 5-6: Complete Syllabus Scan</h4>
      <ul>
        <li>Quick revision of all chapters</li>
        <li>Use your notes and mind maps</li>
        <li>Identify weak areas and give them extra time</li>
        <li>Solve sample papers under timed conditions</li>
      </ul>

      <h4>Day 7: Final Polish</h4>
      <ul>
        <li>Revise formulas, definitions, and important points</li>
        <li>Go through your error log from practice tests</li>
        <li>Stay calm and confident</li>
        <li>Get adequate sleep the night before</li>
      </ul>

      <h3>Important Tips</h3>
      <ul>
        <li><strong>Don't Panic:</strong> Stay calm and focused. Stress will only hamper your performance.</li>
        <li><strong>Prioritize:</strong> Focus on high-weightage topics first.</li>
        <li><strong>Use Visual Aids:</strong> Diagrams, flowcharts, and mind maps help in quick revision.</li>
        <li><strong>Practice Writing:</strong> Practice writing answers to improve speed and presentation.</li>
        <li><strong>Stay Healthy:</strong> Eat well, sleep adequately, and take short breaks.</li>
        <li><strong>Avoid New Topics:</strong> Don't try to learn completely new concepts at this stage.</li>
      </ul>

      <h3>What NOT to Do</h3>
      <ul>
        <li>Don't stay up all night studying</li>
        <li>Don't compare your preparation with others</li>
        <li>Don't skip meals or compromise on sleep</li>
        <li>Don't waste time on social media</li>
        <li>Don't panic if you can't remember everything</li>
      </ul>

      <p><strong>Remember:</strong> The last week is about smart revision, not cramming. Trust your preparation, stay positive, and give your best effort. You've got this!</p>
    `,
    category: 'Study Tips',
    tags: ['Board Exams', 'Revision Strategy', 'Last Week Preparation', 'Study Tips'],
    isPublished: true,
    publishedDate: new Date('2024-11-07'),
    views: 517,
    metaTitle: 'How to Revise Full Syllabus One Week Before Board Exam',
    metaDescription: 'Effective last-week revision strategy for board exams. Learn how to cover the entire syllabus in 7 days with this expert guide.',
    metaKeywords: ['Board Exam Revision', 'Last Week Preparation', 'Study Strategy', 'Quick Revision']
  },
  {
    title: 'What are the best options if I don\'t clear JEE Mains or Advanced?',
    slug: 'best-options-if-dont-clear-jee-mains-advanced',
    author: 'JEE',
    excerpt: 'Not clearing JEE doesn\'t mean the end of your engineering or science career. There are numerous excellent alternatives that can lead to successful and fulfilling careers.',
    content: `
      <h2>Alternative Career Paths After JEE</h2>
      <p>Not clearing JEE Mains or Advanced can be disappointing, but it's important to remember that this is not the end of your engineering or science career. There are numerous excellent alternatives that can lead to successful and fulfilling careers.</p>

      <h3>Engineering Colleges Through Other Exams</h3>
      <ul>
        <li><strong>State Engineering Entrance Exams:</strong> Most states conduct their own engineering entrance exams (like MHT-CET, KCET, WBJEE, etc.) for admission to state colleges.</li>
        <li><strong>BITSAT:</strong> For admission to BITS Pilani campuses - among the best private engineering institutes in India.</li>
        <li><strong>VITEEE:</strong> VIT University entrance exam for their campuses across India.</li>
        <li><strong>SRMJEEE:</strong> SRM University entrance exam with good placement records.</li>
        <li><strong>Manipal Entrance Test:</strong> For Manipal Institute of Technology and other Manipal campuses.</li>
      </ul>

      <h3>Alternative Science Careers</h3>
      <ul>
        <li><strong>BSc in Physics/Chemistry/Mathematics:</strong> Pursue research, teaching, or specialized fields like data science.</li>
        <li><strong>Integrated MSc Programs:</strong> 5-year integrated programs at IISERs, NISER, and other institutes.</li>
        <li><strong>BSc + MSc + PhD:</strong> Academic and research career path in premier institutions.</li>
        <li><strong>Actuarial Science:</strong> Highly lucrative career in insurance and risk management.</li>
      </ul>

      <h3>Professional Courses</h3>
      <ul>
        <li><strong>Chartered Accountancy (CA):</strong> Prestigious and high-paying career in finance.</li>
        <li><strong>Company Secretary (CS):</strong> Corporate governance and compliance expert.</li>
        <li><strong>Cost and Management Accountancy (CMA):</strong> Financial planning and analysis.</li>
        <li><strong>Bachelor of Computer Applications (BCA):</strong> IT and software development career.</li>
      </ul>

      <h3>Emerging Fields</h3>
      <ul>
        <li><strong>Data Science and AI:</strong> High demand with excellent salary packages.</li>
        <li><strong>Cybersecurity:</strong> Critical field with growing opportunities.</li>
        <li><strong>Digital Marketing:</strong> Creative and analytical career option.</li>
        <li><strong>Animation and VFX:</strong> For creative minds interested in technology.</li>
        <li><strong>Game Development:</strong> Combine coding with creativity.</li>
      </ul>

      <h3>Gap Year Options</h3>
      <ul>
        <li><strong>Prepare Again for JEE:</strong> Many students succeed in their second attempt with better preparation.</li>
        <li><strong>Prepare for Other Exams:</strong> NEET (if interested in medical), CLAT (for law), etc.</li>
        <li><strong>Skill Development:</strong> Learn programming, design, or other marketable skills.</li>
        <li><strong>Internships:</strong> Gain practical experience in your field of interest.</li>
      </ul>

      <h3>Important Considerations</h3>
      <ul>
        <li>Research thoroughly before choosing an alternative path</li>
        <li>Consider your interests and strengths, not just peer pressure</li>
        <li>Talk to professionals in fields you're considering</li>
        <li>Don't rush into a decision - take time to evaluate options</li>
        <li>Remember that success is not limited to IITs or NITs</li>
      </ul>

      <p><strong>Final Thoughts:</strong> Your worth is not defined by a single exam. Many successful engineers, scientists, and entrepreneurs didn't go to IITs. What matters is your passion, dedication, and willingness to learn. Choose a path that aligns with your interests and work hard - success will follow!</p>
    `,
    category: 'Career Guidance',
    tags: ['JEE', 'Career Options', 'Engineering', 'Alternative Careers', 'After JEE'],
    isPublished: true,
    publishedDate: new Date('2024-11-08'),
    views: 534,
    metaTitle: 'Best Career Options If You Don\'t Clear JEE Mains or Advanced',
    metaDescription: 'Explore excellent alternative career paths and opportunities if you don\'t clear JEE Mains or Advanced. Your success story starts here!',
    metaKeywords: ['After JEE', 'Career Options', 'Engineering Alternatives', 'JEE Failed']
  }
];

async function createSampleBlogs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📝 Creating sample blogs...');
    for (const blogData of sampleBlogs) {
      const existingBlog = await Blog.findOne({ slug: blogData.slug });
      if (existingBlog) {
        console.log(`⏭️  Blog already exists: "${blogData.title}"`);
        continue;
      }

      const blog = new Blog(blogData);
      await blog.save();
      console.log(`✅ Created blog: "${blog.title}" (slug: ${blog.slug})`);
    }

    console.log('\n🎉 Sample blogs created successfully!');
    console.log('\n📊 Summary:');
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    console.log(`   Total Blogs: ${totalBlogs}`);
    console.log(`   Published: ${publishedBlogs}`);
    console.log(`   Drafts: ${totalBlogs - publishedBlogs}`);

    console.log('\n🔗 Access the blogs at:');
    console.log('   Frontend: http://localhost:5173/blogs');
    console.log('   Admin: http://localhost:5173/admin/dashboard (Manage Blogs)');

  } catch (error) {
    console.error('❌ Error creating sample blogs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

createSampleBlogs();
