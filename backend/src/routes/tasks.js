const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(verifyToken);

router.get('/', getTasks);
router.post('/', verifyRole(['ADMIN', 'MANAGER']), createTask);
router.put('/:id/status', updateTaskStatus);

module.exports = router;
