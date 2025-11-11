/**
 * Production API Server for Kanban Dashboard
 * Runs json-server with CORS enabled for deployment on Render.com
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './public',
});

const PORT = process.env.PORT || 4000;

// Enable CORS for all origins (adjust in production if needed)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kanban API is running' });
});

// Use default router
server.use(router);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on port ${PORT}`);
  console.log(`📊 Resources available at http://localhost:${PORT}/tasks`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);
});
