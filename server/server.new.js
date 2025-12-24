const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/database');
const { cacheMiddleware, clearCache } = require('./middleware/cache');

// Import controllers for dependency injection
const videoController = require('./controllers/videoController');

// Import routes
const videoRoutes = require('./routes/videoRoutes');

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

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

// Connect to database
connectDB();

// Inject clearCache function into video controller
videoController.setClearCacheFunction(clearCache);

// Use MVC routes (refactored)
app.use('/api/videos', cacheMiddleware('videos', 30 * 60 * 1000), videoRoutes);

// Legacy routes (to be refactored later) - Import from old server.js
// For now, keep all other routes as they were...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (MVC Structure)`);
  console.log(`📁 Videos route using Controller/Route pattern`);
  console.log(`🔄 Other routes pending refactor...`);
});
