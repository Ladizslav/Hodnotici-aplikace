const express = require('express');
const mysql = require('mysql');
const app = express();

// Create a connection pool
const db = mysql.createPool({
    host: 'your_host',
    user: 'your_user',
    password: 'your_password',
    database: 'your_database'
});

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to get average rating
app.get('/api/average-rating', (req, res) => {
    const query = "SELECT Porce, Teplota, Vzhled, Apetit FROM Table_rating";

    db.query(query, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: "Failed to retrieve ratings" });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: "No ratings found" });
            return;
        }

        let totalSum = 0;
        const count = results.length;

        results.forEach(row => {
            const rowSum = row.Porce + row.Teplo + row.Vzhled + row.Apetit;
            totalSum += rowSum;
        });

        const average = totalSum / count; //
        const roundedAverage = Math.round(average * 100) / 100; // Round to 2 decimal places

        res.json({ average: roundedAverage });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
