require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve frontend files

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bank_qr_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Setup database (optional auto-setup, better done via schema.sql manually, but here as fallback)
async function initializeDB() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully.');
    connection.release();
  } catch (error) {
    console.error('MySQL Connection Error:', error.message);
    console.log('Please ensure your MySQL server is running and database exists (run schema.sql).');
  }
}

// Routes
// 1. API to save bank details and generate URL
app.post('/api/bank-details', async (req, res) => {
  try {
    const { full_name, bank_name, account_number, branch, contact_info } = req.body;

    // Basic Validation
    if (!full_name || !bank_name || !account_number || !branch) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Generate unique ID
    const id = uuidv4();

    // Insert into DB
    const query = `
      INSERT INTO bank_details (id, full_name, bank_name, account_number, branch, contact_info)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [id, full_name, bank_name, account_number, branch, contact_info || null];
    
    await pool.execute(query, values);

    // Create the scan URL (host should be dynamic based on request)
    const protocol = req.protocol;
    const host = req.get('host');
    const scanUrl = `${protocol}://${host}/scan.html?id=${id}`;

    res.status(201).json({ 
      success: true, 
      id, 
      scanUrl 
    });

  } catch (error) {
    console.error('Error saving bank details:', error);
    res.status(500).json({ error: 'Server error while saving details.' });
  }
});

// 2. API to retrieve bank details by ID
app.get('/api/bank-details/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Only retrieve if created within the last 24 hours
    const query = 'SELECT * FROM bank_details WHERE id = ? AND created_at >= NOW() - INTERVAL 24 HOUR';
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bank details not found or this link has expired (24-hour limit).' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error retrieving bank details:', error);
    res.status(500).json({ error: 'Server error while retrieving details.' });
  }
});

// 3. Security Auto-Cleanup: Delete records older than 24 hours automatically
// This runs once every hour silently in the background
setInterval(async () => {
  try {
    const query = 'DELETE FROM bank_details WHERE created_at < NOW() - INTERVAL 24 HOUR';
    const [result] = await pool.execute(query);
    if (result.affectedRows > 0) {
      console.log(`Security: Auto-deleted ${result.affectedRows} expired bank detail records.`);
    }
  } catch (err) {
    console.error('Error during scheduled cleanup:', err);
  }
}, 60 * 60 * 1000); // 1 hour in milliseconds

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeDB();
});
