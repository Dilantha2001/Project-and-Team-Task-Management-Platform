import { Router } from 'express';
import { getUsers, getUserById, updateUserRole, deleteUser, updateUser } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'PROJECT_MANAGER']), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize(['ADMIN']), updateUser);
router.patch('/:id/role', authorize(['ADMIN']), updateUserRole);
router.delete('/:id', authorize(['ADMIN']), deleteUser);

export default router;
