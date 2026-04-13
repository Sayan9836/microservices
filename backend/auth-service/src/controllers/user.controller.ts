import { prisma } from '@/config/db';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { sign, type SignOptions } from 'jsonwebtoken';
import { publishUserDeleted } from '@/config/rabbitmq';

const saltRounds = 10;

interface TokenPayload {
    userId: string;
    email?: string;
}

type TokenType = 'access' | 'refresh'

const createToken = (
    payload: TokenPayload,
    type: TokenType
): string  => {

    const config = {
        access: {
            secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        }
    }

    const { secret, expiresIn } = config[type];

    return sign(payload, secret, { expiresIn } as SignOptions);
}
const createAuthToken = (payload: TokenPayload) => {
    return {
        accessToken:  createToken(payload, 'access'),
        refreshToken:  createToken(payload, 'refresh')
    }
}

export const register = async (req: Request, res: Response) => {

    try {
        const {name, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
                data: null
            })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        if (!hashedPassword) {
            return res.status(400).json({
                success: false,
                message: 'bcrypt ne dokha de dia :)',
                data: null
            })
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })


        return res.status(201).json({
            success: true,
            message: 'User registered successfully. Please login to continue',
            data: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'registration unsuccessfull',
            data: null
        })    
    }
}


export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exists',
                data: null
            })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password)

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
                data: null            
            })
        }

        const { accessToken, refreshToken } = createAuthToken({ userId: existingUser.id, email: existingUser.email})

        return res.status(200).json({
            success: true,
            message: 'loggedIn successfully',
            data: {
                existingUser,
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'registration unsuccessfull',
            data: null
        })  
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // 1. Delete user from Auth database
        await prisma.user.delete({
            where: { id: id as string }
        });

        // 2. Publish event to RabbitMQ so Task Service can clean up
        publishUserDeleted(id as string);

        return res.status(200).json({
            success: true,
            message: 'User deleted and cleanup event published'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'failed to delete user'
        });
    }
}