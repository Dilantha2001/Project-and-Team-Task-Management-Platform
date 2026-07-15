const db = require('../db');

// Create a new project (Manager only)
const createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  try {
    const result = await db.query(
      'INSERT INTO projects (name, description, manager_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

// Get all projects based on role
const getProjects = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'ADMIN') {
      result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    } else if (req.user.role === 'MANAGER') {
      result = await db.query('SELECT * FROM projects WHERE manager_id = $1 ORDER BY created_at DESC', [req.user.id]);
    } else {
      // Member gets assigned projects
      result = await db.query(`
        SELECT p.* FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = $1 ORDER BY p.created_at DESC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

// Assign member to a project (Manager only)
const assignMember = async (req, res) => {
  const { id } = req.params; // project ID
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: 'User ID is required' });

  try {
    // Check if user has permission (is admin or is the manager of this project)
    const projectCheck = await db.query('SELECT manager_id FROM projects WHERE id = $1', [id]);
    if (projectCheck.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    
    if (req.user.role !== 'ADMIN' && projectCheck.rows[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to manage this project' });
    }

    // Assign member
    await db.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, user_id]
    );

    res.json({ message: 'Member assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error assigning member' });
  }
};

module.exports = { createProject, getProjects, assignMember };
