import { Router } from 'express';
import { getProjects, createProject } from '../controllers/projectController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', authorize(['ADMIN', 'PROJECT_MANAGER']), createProject);

export default router;
