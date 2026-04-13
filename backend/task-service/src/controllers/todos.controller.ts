import { prisma } from "@/config/db"
import type { Request, Response } from "express"

export const addTodo = async (req: Request, res: Response) => {

    const { name } = req.body

    if (!name) {
        return res.status(404).json({
            success: false,
            message: 'name is required',
            data: null
        })
    }
    try {
        const todo = await prisma.todo.create({
            data: { 
                name,
                userId: (req as any).user.id
            }
        })


        return res.status(201).json({
            success: true,
            message: 'todo created successfully',
            data: todo
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to create todo'
        })
    }
}