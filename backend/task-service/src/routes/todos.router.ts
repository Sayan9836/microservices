import { addTodo, deleteTodo, getTodos, updateTodo } from "@/controllers/todos.controller";
import { auth } from "@/middleware/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Task API is reachable via Gateway' });
});

todoRouter.get('/', auth(), getTodos);
todoRouter.post('/', auth('addTodo'), addTodo);
todoRouter.patch('/:id', auth(), updateTodo);
todoRouter.delete('/:id', auth(), deleteTodo);


export default todoRouter;

