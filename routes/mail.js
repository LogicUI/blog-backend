const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 587
})


const mailOptions = {
    from: process.env.EMAIL_HOST,
    to: "johnwee35@gmail.com",
    subject: "testEmail",
    text: "this is a test email"
}

router.get("/test", (req, res) => {
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).send('Email sent: ' + info.response);
        }
    })
})

module.exports = router;