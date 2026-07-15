const db = require('../db');

// Create a task (Manager only)
const createTask = async (req, res) => {
  const { title, description, project_id, assigned_to } = req.body;
  if (!title || !project_id) return res.status(400).json({ error: 'Title and project_id are required' });

  try {
    // Check if the user is authorized to add a task to this project
    const projectCheck = await db.query('SELECT manager_id FROM projects WHERE id = $1', [project_id]);
    if (projectCheck.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    
    if (req.user.role !== 'ADMIN' && projectCheck.rows[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to manage tasks in this project' });
    }

    const result = await db.query(
      'INSERT INTO tasks (title, description, project_id, assigned_to) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, project_id, assigned_to]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating task' });
  }
};

// Get tasks based on role or project_id
const getTasks = async (req, res) => {
  const { project_id } = req.query;

  try {
    let result;
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      if (project_id) {
        result = await db.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC', [project_id]);
      } else if (req.user.role === 'MANAGER') {
         // Manager sees all tasks in projects they manage
         result = await db.query(`
          SELECT t.* FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.manager_id = $1 ORDER BY t.created_at DESC
         `, [req.user.id]);
      } else {
        result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
      }
    } else {
      // Member sees their assigned tasks
      if (project_id) {
        result = await db.query('SELECT * FROM tasks WHERE project_id = $1 AND assigned_to = $2 ORDER BY created_at DESC', [project_id, req.user.id]);
      } else {
        result = await db.query('SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC', [req.user.id]);
      }
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
};

// Update task status (Member can update assigned tasks, Manager can update project tasks)
const updateTaskStatus = async (req, res) => {
  const { id } = req.params; // task ID
  const { status } = req.body;

  if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const taskCheck = await db.query(`
      SELECT t.assigned_to, p.manager_id 
      FROM tasks t 
      JOIN projects p ON t.project_id = p.id 
      WHERE t.id = $1
    `, [id]);

    if (taskCheck.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

    const task = taskCheck.rows[0];

    // Authorization Check
    const isAssignedMember = req.user.role === 'MEMBER' && task.assigned_to === req.user.id;
    const isProjectManager = req.user.role === 'MANAGER' && task.manager_id === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAssignedMember && !isProjectManager && !isAdmin) {
       return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const result = await db.query(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating task' });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };
