require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Retrieve email and password from environment variables
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

// Validate env variables
if (!emailUser || !emailPass) {
    console.error('Please provide EMAIL_USER and EMAIL_PASS in the .env file.');
    process.exit(1); // Exit the application if environment variables are missing
  }

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// API endpoint to send emails
app.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  // Check if required parameters are provided
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Setup email options
  const mailOptions = {
    from: emailUser,
    to,
    subject,
    html
  };

  // verify connection configuration
    transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }

    res.json({ message: 'Email sent successfully', info });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
