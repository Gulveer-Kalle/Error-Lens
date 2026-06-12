const pool = require("../db");

const createEvent = async (req, res) => {
  try {
    const {
      application,
      message,
      severity,
      environment,
      event_type,
      source,
    } = req.body || {};

    if (!application || !message || !severity || !environment) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const resolvedEventType = event_type || 'error';
    const resolvedSource = source || 'unknown';

    const allowedEventTypes = ['error', 'warning', 'info'];
    if (!allowedEventTypes.includes(resolvedEventType)) {
      return res.status(400).json({
        error: 'Invalid event_type',
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

    const userId = req.user && req.user.userId;
    const result = await pool.query(
      `
      INSERT INTO events
      (application, message, severity, environment, event_type, source, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [application, message, severity, environment, resolvedEventType, resolvedSource, userId]
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

    // scope to user
    const userId = req.user && req.user.userId;
    if (userId) {
      values.push(userId);
      conditions.push(`user_id = $${values.length}`);
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
    // 1. Total events
    const userId = req.user && req.user.userId;

    const total = await pool.query(`
      SELECT COUNT(*)::int AS count FROM events WHERE user_id = $1
    `, [userId]);

    // 2. Last 24 hours
    const last24h = await pool.query(`
      SELECT COUNT(*)::int AS count
      FROM events
      WHERE created_at >= NOW() - INTERVAL '24 hours' AND user_id = $1
    `, [userId]);

    // 3. Severity breakdown
    const severity = await pool.query(`
      SELECT severity, COUNT(*)::int AS count
      FROM events
      WHERE user_id = $1
      GROUP BY severity
    `, [userId]);

    // 4. Event type breakdown
    const eventType = await pool.query(`
      SELECT event_type, COUNT(*)::int AS count
      FROM events
      WHERE user_id = $1
      GROUP BY event_type
    `, [userId]);

    // 5. Environment breakdown
    const environment = await pool.query(`
      SELECT environment, COUNT(*)::int AS count
      FROM events
      WHERE user_id = $1
      GROUP BY environment
    `, [userId]);

    res.json({
      total: total.rows[0].count,
      last24h: last24h.rows[0].count,
      severity: severity.rows,
      eventType: eventType.rows,
      environment: environment.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.userId;

    if (!id) {
      return res.status(400).json({ error: 'Missing event id' });
    }

    // verify ownership
    const existing = await pool.query(`SELECT user_id FROM events WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existing.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await pool.query(`DELETE FROM events WHERE id = $1`, [id]);

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getSummary,
  deleteEvent,
}