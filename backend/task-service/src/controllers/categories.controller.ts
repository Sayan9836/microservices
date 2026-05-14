import { prisma } from "@/config/db"
import type { Request, Response } from "express"

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to fetch categories'
        });
    }
}

export const addCategory = async (req: Request, res: Response) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'name is required'
        })
    }

    try {
        const category = await prisma.category.create({
            data: { name }
        })

        return res.status(201).json({
            success: true,
            message: 'category created successfully',
            data: category
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to create category'
        })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name } = req.body;

        const category = await prisma.category.update({
            where: { id },
            data: { name }
        });

        return res.status(200).json({
            success: true,
            message: 'category updated successfully',
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to update category'
        });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        await prisma.category.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: 'category deleted successfully',
            data: { id }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to delete category'
        });
    }
}
