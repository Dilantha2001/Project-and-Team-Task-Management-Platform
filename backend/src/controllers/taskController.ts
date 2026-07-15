import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional(),
});

const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let tasks;

    if (userRole === 'ADMIN') {
      tasks = await prisma.task.findMany({
        include: { project: { select: { name: true } }, assignee: { select: { name: true } } },
      });
    } else if (userRole === 'PROJECT_MANAGER') {
      tasks = await prisma.task.findMany({
        where: { project: { managerId: userId } },
        include: { project: { select: { name: true } }, assignee: { select: { name: true } } },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: userId },
        include: { project: { select: { name: true } } },
      });
    }

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    // Ensure the project belongs to the manager creating the task
    const project = await prisma.project.findUnique({ where: { id: validatedData.projectId } });
    if (!project || project.managerId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized to create tasks for this project' });
      return;
    }

    const task = await prisma.task.create({
      data: validatedData,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    next(error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateTaskStatusSchema.parse(req.body);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Only assignee or manager can update status
    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    if (task.assigneeId !== req.user?.id && project?.managerId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized to update this task' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: validatedData.status },
    });

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    next(error);
  }
};
