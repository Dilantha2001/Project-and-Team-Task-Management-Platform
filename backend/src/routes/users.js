const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// All user routes require authentication and ADMIN role
router.use(verifyToken, verifyRole(['ADMIN']));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
