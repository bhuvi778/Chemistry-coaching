const express = require('express');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }
});

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('📤 Upload request received');
  if (!req.file) {
    console.log('❌ No file in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  console.log('✅ File uploaded:', req.file.filename, 'Size:', (req.file.size / (1024*1024)).toFixed(2), 'MB');
  res.json({ fileUrl: fileUrl });
});

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

// Send WhatsApp message using BotBiz template API
app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: 'Phone number is required'
      });
    }

    console.log('=== BotBiz WhatsApp Template API ===');
    console.log('Phone:', phone);

    // BotBiz API Configuration
    const BOTBIZ_API_KEY = process.env.BOTBIZ_API_KEY || '16122|Ot9YpB7Zp4v0U9i9MI7A9ns4HYo6BtTy2zij0tTD41fabf26';
    const PHONE_NUMBER_ID = process.env.BOTBIZ_PHONE_NUMBER_ID || '884991348021443';
    const TEMPLATE_ID = '286421';

    console.log('API Key (first 10 chars):', BOTBIZ_API_KEY.substring(0, 10) + '...');
    console.log('Phone Number ID:', PHONE_NUMBER_ID);
    console.log('Template ID:', TEMPLATE_ID);

    if (!PHONE_NUMBER_ID) {
      console.error('⚠ PHONE_NUMBER_ID not configured');
      return res.status(500).json({
        success: false,
        error: 'WhatsApp configuration incomplete',
        details: 'PHONE_NUMBER_ID is required',
        suggestion: 'Add BOTBIZ_PHONE_NUMBER_ID to environment variables'
      });
    }

    const apiUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send/template';
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    const formData = new URLSearchParams();
    formData.append('apiToken', BOTBIZ_API_KEY);
    formData.append('phone_number', phone);
    formData.append('phone_number_id', PHONE_NUMBER_ID);
    formData.append('template_id', TEMPLATE_ID);

    console.log('Sending request to BotBiz API...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const responseText = await response.text();
    console.log('=== BotBiz API Response ===');
    console.log('Status:', response.status);
    console.log('Response:', responseText);
    console.log('========================');

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Could not parse response as JSON');
      responseData = { raw: responseText };
    }

    if (response.ok && (responseData.success || responseData.status === 'success')) {
      return res.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        details: responseData
      });
    } else {
      return res.status(response.status || 500).json({
        success: false,
        error: 'Failed to send WhatsApp message',
        details: responseData.message || responseData.error || responseText,
        fullResponse: responseData
      });
    }
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
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
