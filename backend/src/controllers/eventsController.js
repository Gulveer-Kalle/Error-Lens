const pool = require("../db");

const createEvent = async (req, res) => {
  try {
    const {
      application,
      message,
      severity,
      environment,
    } = req.body || {};

    if (!application || !message || !severity || !environment) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const allowedSeverities = [
      "low",
      "medium",
      "high",
      "critical",
    ];

    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({
        error: "Invalid severity",
      });
    }

    const allowedEnvironments = [
      "development",
      "staging",
      "production",
    ];

    if (!allowedEnvironments.includes(environment)) {
      return res.status(400).json({
        error: "Invalid environment",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO events
      (application, message, severity, environment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [application, message, severity, environment]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const { severity, environment, page = 1, limit = 100 } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;
    const offset = (pageNum - 1) * limitNum;

    let query = `SELECT * FROM events`;
    const values = [];
    const conditions = [];

    if (severity) {
      values.push(severity);
      conditions.push(`severity = $${values.length}`);
    }

    if (environment) {
      values.push(environment);
      conditions.push(`environment = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(limitNum, offset);

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getSummary = async (req, res) => {
  try {
    const total = await pool.query(`SELECT COUNT(*)::int AS count FROM events`);
    const critical = await pool.query(`
      SELECT COUNT(*)::int AS count FROM events WHERE severity='critical'
    `);

    const production = await pool.query(`
      SELECT COUNT(*)::int AS count FROM events WHERE environment='production'
    `);

    res.json({
      total: total.rows[0].count,
      critical: critical.rows[0].count,
      production: production.rows[0].count,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getSummary,
}