const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const Video = require('./models/Video');

const app = express();

// CORS configuration for production - Allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes

// Courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enquiries
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Force reseed endpoint (for development)
app.get('/api/reseed', async (req, res) => {
  try {
    await Course.deleteMany({});
    const initialCourses = [
        {
            title: "JEE Advanced - Live Batch 2026",
            grade: "Class 11-12",
            description: "Comprehensive 2-year live program for JEE Main & Advanced with daily classes, doubt sessions, and personalized attention.",
            duration: "2 Years",
            schedule: "Mon-Sat (4:00 PM - 7:00 PM)",
            price: "₹85,000 / Year",
            features: ["Live Interactive Classes", "Daily Practice Papers (DPP)", "Weekly Tests", "1-on-1 Doubt Solving", "Video Lectures Access"],
            color: "cyan",
            categories: ["live-batch"]
        },
        {
            title: "NEET Complete Course - Recorded",
            grade: "Class 11-12",
            description: "Self-paced recorded lectures covering entire NEET syllabus with NCERT focus and unlimited access.",
            duration: "1 Year Access",
            schedule: "Self-Paced",
            price: "₹35,000",
            features: ["800+ Video Lectures", "NCERT Line-by-Line", "Previous Year Solutions", "Study Material PDF", "Lifetime Access"],
            color: "pink",
            categories: ["recorded"]
        },
        {
            title: "1-on-1 Personal Tutoring",
            grade: "All Levels",
            description: "Personalized one-on-one chemistry tutoring tailored to your specific needs and learning pace.",
            duration: "Flexible",
            schedule: "As per your availability",
            price: "₹2,500 / Hour",
            features: ["Individual Attention", "Customized Study Plan", "Flexible Timings", "Topic-wise Focus", "Instant Doubt Clearing"],
            color: "purple",
            categories: ["1-1-tutoring"]
        },
        {
            title: "IIT JEE Mentorship Program",
            grade: "Class 11-12 & Droppers",
            description: "6-month intensive mentorship by IIT alumni focusing on strategy, time management, and mental preparation.",
            duration: "6 Months",
            schedule: "Weekly Sessions",
            price: "₹45,000",
            features: ["Personal Mentor (IIT Alumni)", "Strategy Sessions", "Performance Analysis", "Mock Interviews", "Career Guidance"],
            color: "yellow",
            categories: ["mentorship"]
        },
        {
            title: "24/7 Doubt Solver Subscription",
            grade: "All Students",
            description: "Get your chemistry doubts solved anytime via chat, voice, or video call by expert faculty.",
            duration: "1 Year",
            schedule: "24x7 Available",
            price: "₹15,000 / Year",
            features: ["24/7 Availability", "Text/Voice/Video Support", "Step-by-step Solutions", "Concept Clarification", "Unlimited Questions"],
            color: "green",
            categories: ["doubt-solver"]
        },
        {
            title: "NEET All India Test Series 2026",
            grade: "NEET Aspirants",
            description: "Comprehensive test series with 50+ full-length mock tests and detailed performance analytics.",
            duration: "1 Year",
            schedule: "Weekly Tests",
            price: "₹12,000",
            features: ["50+ Full Length Tests", "NEET Pattern", "All India Ranking", "Detailed Analysis", "Video Solutions"],
            color: "blue",
            categories: ["test-series"]
        },
        {
            title: "GATE Chemistry - Live Batch",
            grade: "Graduates",
            description: "Specialized live coaching for GATE Chemistry exam with focus on Physical, Organic, and Inorganic Chemistry.",
            duration: "8 Months",
            schedule: "Tue, Thu, Sat (6:00 PM - 9:00 PM)",
            price: "₹55,000",
            features: ["Live Classes", "GATE Previous Years", "Weekly Tests", "Study Material", "Doubt Sessions"],
            color: "orange",
            categories: ["live-batch"]
        },
        {
            title: "CSIR NET Mentorship + Test Series",
            grade: "Post Graduates",
            description: "Complete package for CSIR NET with mentorship and 30+ mock tests.",
            duration: "6 Months",
            schedule: "Bi-weekly Mentorship",
            price: "₹40,000",
            features: ["Expert Mentorship", "30+ Mock Tests", "Previous Year Analysis", "Strategy Sessions", "Performance Tracking"],
            color: "red",
            categories: ["mentorship", "test-series"]
        }
    ];
    await Course.insertMany(initialCourses);
    res.json({ message: 'Database reseeded successfully', count: initialCourses.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed initial data if empty
app.get('/api/seed', async (req, res) => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      const initialCourses = [
          {
              title: "Class 11 - JEE Mains & Advanced",
              grade: "Class 11",
              description: "Complete 2-year foundation program for JEE aspirants. Covers Physical, Organic, and Inorganic Chemistry from basics to advanced level.",
              duration: "2 Years",
              schedule: "Mon, Wed, Fri (4:00 PM - 7:00 PM)",
              price: "₹45,000 / Year",
              features: ["Daily Practice Papers (DPP)", "Weekly Tests", "1-on-1 Doubt Solving", "Video Lectures Access"],
              color: "cyan",
              categories: ["jee"]
          },
          {
              title: "Class 12 - NEET Medical",
              grade: "Class 12",
              description: "Intensive 1-year program focusing on NCERT mastery and problem-solving speed for NEET UG.",
              duration: "1 Year",
              schedule: "Tue, Thu, Sat (4:00 PM - 7:00 PM)",
              price: "₹40,000 / Year",
              features: ["NCERT Line-by-Line Analysis", "Previous Year Questions", "All India Test Series", "Printed Study Material"],
              color: "pink",
              categories: ["neet"]
          },
          {
              title: "Dropper's Batch - JEE/NEET",
              grade: "Dropper",
              description: "Rigorous program for repeaters. Fast-track syllabus coverage with focus on high-weightage topics.",
              duration: "8 Months",
              schedule: "Mon to Sat (9:00 AM - 1:00 PM)",
              price: "₹55,000",
              features: ["Daily 4 Hrs Classes", "Rank Booster Package", "Personal Mentorship", "Unlimited Test Series"],
              color: "purple",
              categories: ["jee", "neet"]
          },
          {
              title: "Foundation Pro - Class 9th & 10th",
              grade: "Class 9-10",
              description: "Early start for competitive exams. Focus on Olympiads and strong basics in Science and Math.",
              duration: "1 Year",
              schedule: "Weekends (10:00 AM - 2:00 PM)",
              price: "₹30,000 / Year",
              features: ["Weekend Classes", "Science & Math Focus", "NTSE Prep", "Olympiad Training"],
              color: "green",
              categories: ["foundation"]
          },
          {
              title: "Crash Course - JEE Main",
              grade: "Crash Course",
              description: "Intensive 45-day revision program. Rapid concept coverage with question banks and daily tests.",
              duration: "45 Days",
              schedule: "Daily (9:00 AM - 5:00 PM)",
              price: "₹25,000",
              features: ["Daily Tests", "Short Notes", "Rank Booster", "Quick Revision"],
              color: "yellow",
              categories: ["jee"]
          },
          {
              title: "NEET Biology Special",
              grade: "Class 11-12",
              description: "Dedicated Biology coaching for NEET aspirants with focus on NCERT and previous year questions.",
              duration: "1 Year",
              schedule: "Mon, Wed, Fri (5:00 PM - 7:00 PM)",
              price: "₹35,000 / Year",
              features: ["NCERT Mastery", "Diagram Practice", "Memory Techniques", "Biology Test Series"],
              color: "green",
              categories: ["neet"]
          }
      ];
      await Course.insertMany(initialCourses);
      res.json({ message: 'Seeded' });
    } else {
      res.json({ message: 'Already has data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});