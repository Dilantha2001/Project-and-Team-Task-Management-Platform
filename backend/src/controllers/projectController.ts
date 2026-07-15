import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD']).optional(),
  memberIds: z.array(z.string().uuid()).optional(),
});

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let projects;

    if (userRole === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: { members: true, manager: { select: { id: true, name: true } } },
      });
    } else if (userRole === 'PROJECT_MANAGER') {
      projects = await prisma.project.findMany({
        where: { managerId: userId },
        include: { members: true },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: userId } } },
        include: { manager: { select: { id: true, name: true } } },
      });
    }

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    const managerId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        status: validatedData.status || 'ACTIVE',
        managerId,
        members: {
          create: validatedData.memberIds?.map((userId) => ({
            userId,
          })) || [],
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    next(error);
  }
};
