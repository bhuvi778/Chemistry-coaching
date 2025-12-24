const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const Video = require('./models/Video');
const AudioBook = require('./models/AudioBook');
const StudyMaterial = require('./models/StudyMaterial');
const Magazine = require('./models/Magazine');
const Feedback = require('./models/Feedback');
const WebinarCard = require('./models/WebinarCard');
const Doubt = require('./models/Doubt');
const Crossword = require('./models/Crossword');
const PuzzleSet = require('./models/PuzzleSet');

const app = express();

// In-memory cache with aggressive settings
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour for public data

// Cache middleware - DISABLED for videos to prevent caching issues
const cacheMiddleware = (key, ttl = CACHE_TTL) => {
  return (req, res, next) => {
    // Skip caching for videos endpoint
    if (key === 'videos') {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return next();
    }
    
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('ETag', `"${cached.timestamp}"`);
      return res.json(cached.data);
    }
    res.sendResponse = res.json;
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('ETag', `"${Date.now()}"`);
      res.sendResponse(data);
    };
    next();
  };
};

// Clear cache function
const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
};

// CORS configuration for production - Allow specific origins
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      'https://chemistry-coaching.vercel.app',
      'https://www.chemistry-coaching.vercel.app',
      'https://ace2examz.vercel.app',
      'https://www.ace2examz.vercel.app',
      'https://chemistry-coaching-git-main-bhupeshs-projects-f3c04cb2.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins temporarily for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable GZIP compression
app.use(compression());

// Connect to MongoDB with optimized settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/test?appName=Ace2Examz-Cluster';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50, // Increase connection pool
  minPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  family: 4, // Use IPv4, skip IPv6
  compressors: ['zlib'], // Enable compression
  readPreference: 'secondaryPreferred' // Read from secondary for faster response
}).then(() => {
  console.log('✅ Connected to MongoDB with optimized settings');
  console.log('📊 Connection pool size: 50');
  console.log('🗜️  Compression enabled');
}).catch(err => console.error('❌ MongoDB connection error:', err));

// Routes

// Courses
app.get('/api/courses', cacheMiddleware('courses', 30 * 60 * 1000), async (req, res) => {
  try {
    const courses = await Course.find()
      .select('-__v')
      .limit(100)
      .lean()
      .exec();
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
    clearCache('courses');
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
    clearCache('courses');
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    clearCache('courses');
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enquiries
app.get('/api/enquiries', cacheMiddleware('enquiries', 5 * 60 * 1000), async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .select('-__v')
      .sort({ date: -1 })
      .limit(200)
      .lean()
      .exec();
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

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contacts
app.get('/api/contacts', cacheMiddleware('contacts', 5 * 60 * 1000), async (req, res) => {
  try {
    const contacts = await Contact.find()
      .select('-__v')
      .sort({ date: -1 })
      .limit(200)
      .lean()
      .exec();
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

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Videos
app.get('/api/videos', cacheMiddleware('videos', 30 * 60 * 1000), async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true })
      .select('title description category examType youtubeId instructor duration classNotes isActive createdAt views')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    console.log('=== RECEIVED VIDEO POST REQUEST ===');
    console.log('Request body:', req.body);
    console.log('YouTube ID received:', req.body.youtubeId);
    
    const video = new Video(req.body);
    await video.save();
    
    console.log('Video saved successfully:', video._id);
    console.log('Saved YouTube ID:', video.youtubeId);
    console.log('===================================');
    
    // Clear cache so new video shows immediately
    clearCache('videos');
    
    res.json(video);
  } catch (error) {
    console.error('Error saving video:', error.message);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Clear cache so updated video shows immediately
    clearCache('videos');
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    // Clear cache so deletion reflects immediately
    clearCache('videos');
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Audio Books Routes
app.get('/api/audiobooks', cacheMiddleware('audiobooks', 30 * 60 * 1000), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const audioBooks = await AudioBook.find({ isActive: true })
      .select('title description author category createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    
    const total = await AudioBook.countDocuments({ isActive: true });
    
    res.json({
      audioBooks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single audiobook with full details (for detail page)
app.get('/api/audiobooks/:id', cacheMiddleware('audiobook'), async (req, res) => {
  try {
    const audioBook = await AudioBook.findById(req.params.id).lean().exec();
    if (!audioBook) {
      return res.status(404).json({ message: 'Audiobook not found' });
    }
    res.json(audioBook);
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
app.get('/api/study-materials', cacheMiddleware('study-materials', 30 * 60 * 1000), async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ isActive: true })
      .select('title description category examType fileType fileSize createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single study material with full details
app.get('/api/study-materials/:id', cacheMiddleware('study-material'), async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).lean().exec();
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    res.json(material);
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
app.get('/api/magazines', cacheMiddleware('magazines', 30 * 60 * 1000), async (req, res) => {
  try {
    const magazines = await Magazine.find({ isActive: true })
      .select('title description month year category createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();
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

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webinar Cards
app.get('/api/webinar-cards', async (req, res) => {
  try {
    const cards = await WebinarCard.find().sort({ order: 1 });
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

// Doubts
// Get published doubts only (for public display) - MUST come before /api/doubts
app.get('/api/doubts/published', async (req, res) => {
  try {
    const doubts = await Doubt.find({ isPublished: true, status: 'answered' })
      .sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/doubts', async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/doubts', async (req, res) => {
  try {
    console.log('Received doubt data:', req.body);
    
    // Validate required fields
    const { question, studentName, studentEmail, studentPhone } = req.body;
    if (!question || !studentName || !studentEmail || !studentPhone) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['question', 'studentName', 'studentEmail', 'studentPhone'],
        received: Object.keys(req.body)
      });
    }
    
    const doubt = new Doubt(req.body);
    await doubt.save();
    console.log('Doubt saved successfully:', doubt);
    res.json(doubt);
  } catch (error) {
    console.error('Error saving doubt:', error);
    res.status(500).json({ 
      message: error.message, 
      details: error.errors,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/doubts/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/doubts/:id', async (req, res) => {
  try {
    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doubt deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doubt reaction endpoint (like/dislike)
app.post('/api/doubts/:id/reaction', async (req, res) => {
  try {
    const { reactionType } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    if (reactionType === 'like') {
      doubt.likes += 1;
    } else if (reactionType === 'dislike') {
      doubt.dislikes += 1;
    }
    
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crosswords
app.get('/api/crosswords', cacheMiddleware('crosswords', 30 * 60 * 1000), async (req, res) => {
  try {
    const crosswords = await Crossword.find()
      .select('title description chapter topic examType difficulty createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
    res.json(crosswords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single crossword with full details
app.get('/api/crosswords/:id', cacheMiddleware('crossword'), async (req, res) => {
  try {
    const crossword = await Crossword.findById(req.params.id).lean().exec();
    if (!crossword) {
      return res.status(404).json({ message: 'Crossword not found' });
    }
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/crosswords', async (req, res) => {
  try {
    const crossword = new Crossword(req.body);
    await crossword.save();
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/crosswords/:id', async (req, res) => {
  try {
    const crossword = await Crossword.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/crosswords/:id', async (req, res) => {
  try {
    await Crossword.findByIdAndDelete(req.params.id);
    res.json({ message: 'Crossword deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Puzzle Sets
app.get('/api/puzzle-sets', cacheMiddleware('puzzle-sets', 30 * 60 * 1000), async (req, res) => {
  try {
    const puzzleSets = await PuzzleSet.find()
      .select('setNumber title description chapter topic examType difficulty createdAt')
      .sort({ setNumber: 1 })
      .limit(100)
      .lean()
      .exec();
    res.json(puzzleSets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/puzzle-sets', async (req, res) => {
  try {
    const puzzleSet = new PuzzleSet(req.body);
    await puzzleSet.save();
    res.json(puzzleSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/puzzle-sets/:id', async (req, res) => {
  try {
    const puzzleSet = await PuzzleSet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(puzzleSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/puzzle-sets/:id', async (req, res) => {
  try {
    await PuzzleSet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Puzzle set deleted' });
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
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});