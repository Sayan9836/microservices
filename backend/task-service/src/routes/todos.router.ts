import { addTodo } from "@/controllers/todos.controller";
import { auth } from "@/middleware/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.post('/', auth('addTodo'), addTodo);


export default todoRouter;

