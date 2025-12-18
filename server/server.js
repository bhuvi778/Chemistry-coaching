const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const Video = require('./models/Video');
const AudioBook = require('./models/AudioBook');
const StudyMaterial = require('./models/StudyMaterial');
const Magazine = require('./models/Magazine');
const MeetingRequest = require('./models/MeetingRequest');
const WebinarCard = require('./models/WebinarCard');
const Doubt = require('./models/Doubt');

const app = express();

// CORS configuration for production - Allow specific origins
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      'https://chemistry-coaching.vercel.app',
      'https://www.chemistry-coaching.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for base64 file uploads (audio, PDFs, images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
    console.log('Received course data:', req.body);
    const course = new Course(req.body);
    await course.save();
    console.log('Course saved successfully:', course);
    res.json(course);
  } catch (error) {
    console.error('Error adding course:', error);
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

// Audio Books Routes
app.get('/api/audiobooks', async (req, res) => {
  try {
    const audioBooks = await AudioBook.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(audioBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/audiobooks', async (req, res) => {
  try {
    const audioBook = new AudioBook(req.body);
    await audioBook.save();
    res.json(audioBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/audiobooks/:id', async (req, res) => {
  try {
    const audioBook = await AudioBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(audioBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/audiobooks/:id', async (req, res) => {
  try {
    await AudioBook.findByIdAndDelete(req.params.id);
    res.json({ message: 'Audio book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Study Materials Routes
app.get('/api/study-materials', async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/study-materials', async (req, res) => {
  try {
    const material = new StudyMaterial(req.body);
    await material.save();
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/study-materials/:id', async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/study-materials/:id', async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Study material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Magazines Routes
app.get('/api/magazines', async (req, res) => {
  try {
    const magazines = await Magazine.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(magazines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/magazines', async (req, res) => {
  try {
    const magazine = new Magazine(req.body);
    await magazine.save();
    res.json(magazine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/magazines/:id', async (req, res) => {
  try {
    const magazine = await Magazine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(magazine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/magazines/:id', async (req, res) => {
  try {
    await Magazine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Magazine deleted' });
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

// Send App Link via WhatsApp/SMS
app.post('/api/send-app-link', async (req, res) => {
  try {
    const { countryCode, mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber.length < 10) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    const fullNumber = countryCode + mobileNumber;
    const appLink = 'https://play.google.com/store/apps/details?id=com.ace2examzapp.android&hl=en_IN';

    // Send to WhatsApp webhook
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const webhookUrl = 'https://dash.botbiz.io/webhook/whatsapp-workflow/37938.234726.277083.1765173100';
    const payload = {
      phone: fullNumber,
      message: `Download Ace2Examz App: ${appLink}`
    };
    let webhookResult = null;
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      webhookResult = await webhookRes.text();
    } catch (err) {
      console.error('Error calling WhatsApp webhook:', err);
    }

    // Store the request in database (optional)
    const contact = new Contact({
      name: 'App Link Request',
      email: `${mobileNumber}@sms.request`,
      phone: fullNumber,
      message: `Requested app download link`
    });
    await contact.save();

    res.json({
      success: true,
      message: 'App link will be sent to your mobile number shortly',
      phone: fullNumber,
      webhookResult
    });
  } catch (error) {
    console.error('Error sending app link:', error);
    res.status(500).json({ message: 'Failed to send app link. Please try again.' });
  }
});

// Meeting Requests Routes
app.get('/api/meeting-requests', async (req, res) => {
  try {
    const requests = await MeetingRequest.find().sort({ submittedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/meeting-requests', async (req, res) => {
  try {
    const meetingRequest = new MeetingRequest(req.body);
    await meetingRequest.save();
    res.json(meetingRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/meeting-requests/:id', async (req, res) => {
  try {
    await MeetingRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webinar Cards Routes
app.get('/api/webinar-cards', async (req, res) => {
  try {
    const cards = await WebinarCard.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/webinar-cards', async (req, res) => {
  try {
    const card = new WebinarCard(req.body);
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/webinar-cards/:id', async (req, res) => {
  try {
    const card = await WebinarCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/webinar-cards/:id', async (req, res) => {
  try {
    await WebinarCard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Webinar card deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doubts/Q&A Routes
// Get published doubts (for students)
app.get('/api/doubts/published', async (req, res) => {
  try {
    const doubts = await Doubt.find({ isPublished: true, status: 'answered' }).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all doubts (for admin)
app.get('/api/doubts', async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new doubt
app.post('/api/doubts', async (req, res) => {
  try {
    const doubt = new Doubt(req.body);
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doubt (answer it)
app.put('/api/doubts/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      answeredAt: new Date()
    };
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete doubt
app.delete('/api/doubts/:id', async (req, res) => {
  try {
    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doubt deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});