import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controllers/taskController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', authorize(['PROJECT_MANAGER']), createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
