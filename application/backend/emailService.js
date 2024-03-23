const nodemailer = require('nodemailer');

// Setup transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail. Use your actual email service
    auth: {
        user: 'csc848verify@gmail.com', // Change to your email
        pass: 'tupw rbco igwg zxou',
    },
});

// Function to send OTP email
const sendOtpEmail = (toEmail, otp) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'csc848verify@gmail.com', // Your email address
            to: toEmail,
            subject: 'Your OTP',
            text: `Here is your OTP: ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error); // Rejects the promise in case of an error
            } else {
                console.log('Email sent:', info.response);
                resolve(info); // Resolves the promise on successful email sending
            }
        });
    });
};

module.exports = {
    sendOtpEmail,
};


