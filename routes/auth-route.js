const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const knex = require("../db");
const short = require('short-uuid');
const nodemailer = require("nodemailer");
const moment = require("moment");


const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 587
})




router.post("/register", async (req, res, next) => {


    const { userName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const randomToken = short().new();

    const user = {
        userName,
        email,
        password: hashPassword,
    }

    const mailOptions = {
        from: process.env.EMAIL_HOST,
        to: `${email}`,
        subject: "verify your email",
        text: `localhost:3000/verify/${randomToken}`
    }

    try {

        await knex("users").insert(user);

        await knex("token").insert({
            uuid: randomToken,
            userName,
            expiry_time: moment().add(15,"minutes").format("YYYY-MM-DD HH:mm:ss")
        }).catch(err => {
            next(err);
        })


        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                next(err);
            } else {
                res.status(200).send('registered successfully please check your email: ' + info.response);
            }
        })


    } catch (err) {
        if (err.errno === 1062) {
            res.status(401).send("this user has already been registered");
        }
    }


})


router.put("/verify", async (req, res, next) => {

    const {uuid} = req.body;

    const {expiry_time} =  await knex("token")
                          .select("expiry_time")
                          .where({uuid})
                          .first()

    if(!expiry_time){
        res.status(404).send("token not found");
    }

    const timeDifference = moment().diff(moment(expiry_time),"minutes");
    
    if(timeDifference > 15){
        res.status(403).send("token expired please request a new token");
    }



})



router.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    const [foundPassword] = await knex("users").pluck("password").where({ userName });
    if (!foundPassword) {
        res.status(401).send("Invalid username")
    }
    const checkPasswordValid = await bcrypt.compare(password, foundPassword);
    if (checkPasswordValid) {
        const token = jwt.sign({
            data: req.body
        }, "secret", { expiresIn: "1d" });

        res.status(200).send({
            message: "login successfully",
            token
        })
    } else {
        res.status(401).send("Invalid password");
    }


})

module.exports = router;