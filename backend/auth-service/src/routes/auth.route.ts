import { Router } from "express";
import { login, register, deleteUser } from "@/controllers/user.controller";
const authRouter = Router();


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.delete('/:id', deleteUser)


export default authRouter;