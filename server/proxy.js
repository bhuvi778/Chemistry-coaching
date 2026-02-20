const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const app = express();

// Create a proxy middleware instance
const proxy = createProxyMiddleware({
  target: 'http://localhost:5001', // Target server
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  logLevel: 'info'
});

// Use the proxy middleware
app.use('/', proxy);

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`🔄 Proxy server running on port ${PORT}, forwarding to 5001`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Proxy server shutting down...');
  server.close(() => {
    console.log('✅ Proxy server closed');
    process.exit(0);
  });
});

module.exports = server;