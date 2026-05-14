import { prisma } from "@/config/db"
import type { Request, Response } from "express"

export const getTags = async (_req: Request, res: Response) => {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' }
        });

        return res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to fetch tags'
        });
    }
}

export const addTag = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'name is required'
        });
    }

    try {
        // We use upsert so if the user types a tag that already exists, 
        // it just returns the existing one instead of throwing a unique constraint error
        const tag = await prisma.tag.upsert({
            where: { name: name.toLowerCase() },
            update: {},
            create: { name: name.toLowerCase() }
        });

        return res.status(201).json({
            success: true,
            message: 'tag processed successfully',
            data: tag
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to create tag'
        });
    }
}

export const deleteTag = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        await prisma.tag.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: 'tag deleted successfully',
            data: { id }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to delete tag'
        });
    }
}
