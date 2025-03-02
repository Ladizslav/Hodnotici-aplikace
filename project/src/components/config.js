require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'yourSuperSecretKey',
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        user: process.env.SMTP_USER || 'your_smtp_user',
        pass: process.env.SMTP_PASS || 'your_smtp_password',
        // The sender email address for outgoing mails.
        sender: process.env.SENDER_EMAIL || 'no-reply@yourdomain.com'
    },
    // Create a RegExp instance from the environment variable.
    emailRegex: new RegExp(process.env.EMAIL_REGEX || '^[\\w.-]+@spsejecna\\.cz$', 'i')
};

module.exports = config;
