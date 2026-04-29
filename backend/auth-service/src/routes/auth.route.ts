import { Router } from "express";
import { login, register, deleteUser } from "@/controllers/user.controller";
const authRouter = Router();

authRouter.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Auth API is reachable via Gateway' });
});

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.delete('/:id', deleteUser)


export default authRouter;