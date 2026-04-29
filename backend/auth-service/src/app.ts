import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.route';

const app = express();

app.use(cors())
app.use(express.json())

// Simple Request Logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Auth Service is running'
    });
});


app.use('/api/v1/auth', authRouter);

export default app;



