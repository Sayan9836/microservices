import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todos.router';

const app = express();

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Task Service is running'
    });
});

app.use('/api/v1/tasks', todoRouter);

export default app;



