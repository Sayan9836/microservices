import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Health check (gateway's own endpoint)
app.get('/health', (_req, res) => {
  res.json({ status: 'Gateway is running' });
});

// Auth Service Proxy — pathFilter keeps the full URL intact
app.use(createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  changeOrigin: true,
  pathFilter: '/api/v1/auth',
}));

// Task Service Proxy
app.use(createProxyMiddleware({
  target: process.env.TASK_SERVICE_URL || 'http://task-service:3002',
  changeOrigin: true,
  pathFilter: '/api/v1/tasks',
}));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`👉 Auth requests -> ${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}`);
  console.log(`👉 Task requests -> ${process.env.TASK_SERVICE_URL || 'http://task-service:3002'}`);
});
