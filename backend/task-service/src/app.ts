import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todos.router';

const app = express();

app.use(cors())
app.use(express.json())

// Simple Request Logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (_req, _res) => {
    _res.json({
        success: true,
        message: 'Task Service is running'
    });
});


app.use('/api/v1/tasks', todoRouter);

export default app;



