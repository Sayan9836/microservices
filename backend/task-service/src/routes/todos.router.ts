import { addTodo, deleteTodo, getTodos, updateTodo } from "@/controllers/todos.controller";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/controllers/categories.controller";
import { getTags, addTag, deleteTag } from "@/controllers/tags.controller";
import { auth } from "@/middleware/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Task API is reachable via Gateway' });
});

// Todo routes
todoRouter.get('/', auth(), getTodos);
todoRouter.post('/', auth('addTodo'), addTodo);
todoRouter.patch('/:id', auth(), updateTodo);
todoRouter.delete('/:id', auth(), deleteTodo);

// Category routes
todoRouter.get('/categories', auth(), getCategories);
todoRouter.post('/categories', auth(), addCategory);
todoRouter.patch('/categories/:id', auth(), updateCategory);
todoRouter.delete('/categories/:id', auth(), deleteCategory);

// Tag routes
todoRouter.get('/tags', auth(), getTags);
todoRouter.post('/tags', auth(), addTag);
todoRouter.delete('/tags/:id', auth(), deleteTag);

export default todoRouter;
