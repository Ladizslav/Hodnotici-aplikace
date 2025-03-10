require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'yourSuperSecretKey',
    serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        user: process.env.SMTP_USER || 'noreplysnacktrack@gmail.com',
        pass: process.env.SMTP_PASS || 'SnackTrack123',
        // The sender email address for outgoing mails.
        sender: process.env.SENDER_EMAIL || 'noreplysnacktrack@gmail.com'
    },
    // Create a RegExp instance from the environment variable.
    emailRegex: new RegExp(process.env.EMAIL_REGEX || '^[\\w.-]+@spsejecna\\.cz$', 'i')
};

module.exports = config;
