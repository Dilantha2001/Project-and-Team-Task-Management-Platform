import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'PROJECT_MANAGER']), getUsers);
router.get('/:id', getUserById);

export default router;
