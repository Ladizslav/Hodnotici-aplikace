const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../components/config');

const app = express();
app.use(express.json());
//const PORT = 3000;
// Enable CORS so that requests from the front end are allowed
app.use(cors());

// Configure nodemailer transporter using settings from config.
const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false, // Upgrade with STARTTLS if needed.
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
});

// Replace this URL with the actual URL from which you want to scrape the lunch data.
const TARGET_URL = "https://strav.nasejidelna.cz/0341/login";

async function scrapeJecnaLunches() {
    try {
        const { data: html } = await axios.get(TARGET_URL, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
            }
        });

        const $ = cheerio.load(html);
        const days = [];

        // Iterate over each day block on the page.
        $(".jidelnicekDen").each((i, dayElem) => {
            const dayHeader = $(dayElem).find(".jidelnicekTop").text().trim();
            const dateMatch = dayHeader.match(/\d{2}\.\d{2}\.\d{4}/);
            const date = dateMatch ? dateMatch[0] : "Unknown date";

            const lunches = [];

            // Process each lunch container.
            $(dayElem)
                .find(".container")
                .each((j, container) => {
                    const hallName = $(container)
                        .find(".shrinkedColumn.jidelnicekItem span")
                        .text()
                        .trim();

                    // Only process containers where the dining hall is "Ječná"
                    if (hallName.includes("Ječná")) {
                        const lunchType = $(container)
                            .find(".shrinkedColumn.smallBoldTitle.jidelnicekItem span")
                            .text()
                            .trim();

                        // Clone the details element, then remove sub elements (nutritional info)
                        const $lunchDetailsElem = $(container)
                            .find(".column.jidelnicekItem")
                            .clone();
                        $lunchDetailsElem.find("sub").remove();
                        const lunchDetails = $lunchDetailsElem.text().trim();

                        lunches.push({
                            type: lunchType,
                            details: lunchDetails
                        });
                    }
                });

            if (lunches.length > 0) {
                days.push({
                    date,
                    lunches
                });
            }
        });

        return days;
    } catch (error) {
        console.error("Error fetching or scraping:", error.message);
        throw error;
    }
}

// API endpoint to return the scraped "Ječná" lunches.
app.get("/api/jecnalunches", async (req, res) => {
    try {
        const data = await scrapeJecnaLunches();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape lunch data." });
    }
});

// POST /api/auth/login
// Validate the email with the regex from config, generate a short‐lived JWT,
// and send the magic link to the provided email.
app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;

    // Ensure the email is provided.
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    // Validate email against the regex configured for allowed domains.
    if (!config.emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: 'Invalid email. Use an address ending with @spsejecna.cz.' });
    }

    // Generate a JWT token valid for 15 minutes.
    const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '15m' });

    // Construct the magic link URL.
    const magicLink = `${config.serverUrl}/api/auth/verify?token=${token}`;

    try {
        // Send the magic link email.
        await transporter.sendMail({
            from: `"No Reply" <${config.smtp.sender}>`,
            to: email,
            subject: 'Your Login Link',
            text: `Click this link to log in: ${magicLink}`,
            html: `<p>Click this link to log in:</p>
             <p><a href="${magicLink}">${magicLink}</a></p>`
        });

        return res.json({
            message:
                'A magic login link has been sent to your email. Please check your inbox.'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send login email.' });
    }
});

// GET /api/auth/verify
// Validate the provided JWT token, extract the username (the part before "@"),
// and issue a longer-lived token for subsequent API calls.
app.get('/api/auth/verify', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is missing.' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        const { email } = decoded;
        const username = email.split('@')[0];

        // Generate a longer-lived token (e.g., 1 hour) for the session.
        const authToken = jwt.sign({ email, username }, config.jwtSecret, {
            expiresIn: '1h'
        });

        return res.json({
            message: 'Successfully logged in.',
            token: authToken,
            username
        });
    });
});

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});