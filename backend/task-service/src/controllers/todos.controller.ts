import { prisma } from "@/config/db"
import type { Request, Response } from "express"
import { publishTodoCreated } from "@/config/rabbitmq"

export const getTodos = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const todos = await prisma.todo.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            success: true,
            data: todos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to fetch todos'
        });
    }
}

export const addTodo = async (req: Request, res: Response) => {

    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'name is required',
            data: null
        })
    }
    try {
        const userId = (req as any).user.id;
        const todo = await prisma.todo.create({
            data: { 
                name,
                userId,
                categoryId: req.body.categoryId || null
            },
            include: { category: true }
        })

        // Publish event to RabbitMQ
        publishTodoCreated(userId);

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

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, completed } = req.body;
        const userId = (req as any).user.id;

        const todo = await prisma.todo.update({
            where: { id, userId },
            data: { 
                name, 
                completed,
                categoryId: req.body.categoryId
            },
            include: { category: true }
        });

        return res.status(200).json({
            success: true,
            message: 'todo updated successfully',
            data: todo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to update todo'
        });
    }
}

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        await prisma.todo.delete({
            where: { id, userId }
        });

        return res.status(200).json({
            success: true,
            message: 'todo deleted successfully',
            data: { id }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to delete todo'
        });
    }
}