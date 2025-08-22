const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Configure your email transport (use environment variables for real projects)
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
        user: 'resend', // replace with your Resend API key
        pass: 're_8zFwbsmW_LUqxhtnTFWDLiCGGKC1MRtdy' // Resend uses API key as user, leave pass empty
    }
});

app.post('/send-chart', async (req, res) => {
    const { email, imageData } = req.body;
    if (!email || !imageData) {
        return res.status(400).json({ error: 'Missing email or image data' });
    }

    try {
        await transporter.sendMail({
            from: 'test@resend.dev',
            to: email,
            subject: 'Your Bucks2Bar Chart',
            text: 'Attached is your chart from Bucks2Bar.',
            attachments: [
            {
                filename: 'chart.png',
                content: imageData.split('base64,')[1],
                encoding: 'base64'
            }
            ]
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});