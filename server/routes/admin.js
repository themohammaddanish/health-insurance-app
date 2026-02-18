const express = require('express');
const pool = require('../config/db');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, isAdmin);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/plans
router.get('/plans', async (req, res) => {
  try {
    const [plans] = await pool.query('SELECT * FROM insurance_plans ORDER BY id ASC');
    res.json({ plans });
  } catch (err) {
    console.error('Admin plans error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/admin/plans
router.post('/plans', async (req, res) => {
  try {
    const { plan_name, coverage_amount, base_price, description } = req.body;
    if (!plan_name || !coverage_amount || !base_price) {
      return res.status(400).json({ message: 'Plan name, coverage amount, and base price are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO insurance_plans (plan_name, coverage_amount, base_price, description) VALUES (?, ?, ?, ?)',
      [plan_name, coverage_amount, base_price, description || '']
    );
    res.status(201).json({ message: 'Plan created.', plan: { id: result.insertId, plan_name, coverage_amount, base_price, description } });
  } catch (err) {
    console.error('Admin create plan error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/admin/plans/:id
router.put('/plans/:id', async (req, res) => {
  try {
    const { plan_name, coverage_amount, base_price, description } = req.body;
    const [result] = await pool.query(
      'UPDATE insurance_plans SET plan_name = ?, coverage_amount = ?, base_price = ?, description = ? WHERE id = ?',
      [plan_name, coverage_amount, base_price, description, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Plan not found.' });
    }
    res.json({ message: 'Plan updated.' });
  } catch (err) {
    console.error('Admin update plan error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/admin/plans/:id
router.delete('/plans/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM insurance_plans WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Plan not found.' });
    }
    res.json({ message: 'Plan deleted.' });
  } catch (err) {
    console.error('Admin delete plan error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [predictionCount] = await pool.query('SELECT COUNT(*) as total FROM predictions');
    const [riskDistribution] = await pool.query(
      'SELECT risk_category, COUNT(*) as count FROM predictions GROUP BY risk_category'
    );
    const [monthlyPredictions] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count, AVG(predicted_premium) as avg_premium
       FROM predictions GROUP BY month ORDER BY month DESC LIMIT 12`
    );
    const [avgPremium] = await pool.query('SELECT AVG(predicted_premium) as avg FROM predictions');
    const [planCount] = await pool.query('SELECT COUNT(*) as total FROM insurance_plans');

    res.json({
      analytics: {
        total_users: userCount[0].total,
        total_predictions: predictionCount[0].total,
        total_plans: planCount[0].total,
        avg_premium: avgPremium[0].avg || 0,
        risk_distribution: riskDistribution,
        monthly_predictions: monthlyPredictions
      }
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
