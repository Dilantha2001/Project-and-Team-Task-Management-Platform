const express = require('express');
const router = express.Router();
const { createProject, getProjects, assignMember } = require('../controllers/projectController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(verifyToken);

router.get('/', getProjects);
router.post('/', verifyRole(['ADMIN', 'MANAGER']), createProject);
router.post('/:id/members', verifyRole(['ADMIN', 'MANAGER']), assignMember);

module.exports = router;
