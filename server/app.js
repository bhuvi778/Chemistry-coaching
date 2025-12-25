const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/database');
const { cacheMiddleware, clearCache } = require('./middleware/cache');

// Import controllers
const videoController = require('./controllers/videoController');
const courseController = require('./controllers/courseController');
const enquiryController = require('./controllers/enquiryController');
const contactController = require('./controllers/contactController');
const audioBookController = require('./controllers/audioBookController');
const studyMaterialController = require('./controllers/studyMaterialController');
const magazineController = require('./controllers/magazineController');
const crosswordController = require('./controllers/crosswordController');
const puzzleSetController = require('./controllers/puzzleSetController');

// Import routes
const videoRoutes = require('./routes/videoRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const audioBookRoutes = require('./routes/audioBookRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const magazineRoutes = require('./routes/magazineRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const webinarRoutes = require('./routes/webinarRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const crosswordRoutes = require('./routes/crosswordRoutes');
const puzzleSetRoutes = require('./routes/puzzleSetRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      'https://ace2examz.com',
      'https://www.ace2examz.com',
      'https://chemistry-coaching.vercel.app',
      'https://www.chemistry-coaching.vercel.app',
      'https://ace2examz.vercel.app',
      'https://www.ace2examz.vercel.app',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware - Increase payload size limit for large file uploads (base64 encoded files are ~33% larger)
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 100000 }));
app.use(compression());

// Connect to database
connectDB();

// Inject clearCache function into controllers that need it
videoController.setClearCacheFunction(clearCache);
courseController.setClearCacheFunction(clearCache);
enquiryController.setClearCacheFunction(clearCache);
contactController.setClearCacheFunction(clearCache);
audioBookController.setClearCacheFunction(clearCache);
studyMaterialController.setClearCacheFunction(clearCache);
magazineController.setClearCacheFunction(clearCache);
crosswordController.setClearCacheFunction(clearCache);
puzzleSetController.setClearCacheFunction(clearCache);

// API Routes with caching
app.use('/api/videos', cacheMiddleware('videos', 30 * 60 * 1000), videoRoutes);
app.use('/api/courses', cacheMiddleware('courses', 30 * 60 * 1000), courseRoutes);
app.use('/api/enquiries', cacheMiddleware('enquiries', 5 * 60 * 1000), enquiryRoutes);
app.use('/api/contacts', cacheMiddleware('contacts', 5 * 60 * 1000), contactRoutes);
app.use('/api/audiobooks', cacheMiddleware('audiobooks', 30 * 60 * 1000), audioBookRoutes);
app.use('/api/study-materials', cacheMiddleware('study-materials', 30 * 60 * 1000), studyMaterialRoutes);
app.use('/api/magazines', cacheMiddleware('magazines', 30 * 60 * 1000), magazineRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/webinar-cards', webinarRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/crosswords', cacheMiddleware('crosswords', 30 * 60 * 1000), crosswordRoutes);
app.use('/api/puzzle-sets', cacheMiddleware('puzzle-sets', 30 * 60 * 1000), puzzleSetRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running with MVC architecture',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n🚀 ==========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('📁 MVC Architecture Fully Implemented');
  console.log('🎯 All routes refactored to Controllers');
  console.log('🗂️  Structure:');
  console.log('   - Controllers: 11 files');
  console.log('   - Routes: 11 files');
  console.log('   - Middleware: cache.js');
  console.log('   - Config: database.js');
  console.log('==========================================\n');
});

// Increase timeout for large file uploads (5 minutes)
server.timeout = 300000;
server.keepAliveTimeout = 300000;
server.headersTimeout = 300000;

module.exports = app;
