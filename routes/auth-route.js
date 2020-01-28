const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const knex = require("../db");
const short = require('short-uuid');
const {getTokenRowData, isTokenExpired , verifyUser , generateHashPassword , createUser , sendTokenToEmail, createExpiryToken} = require("../helpers/auth-helper");




router.post("/register", async (req, res, next) => {
    const { userName, email, password } = req.body;
    const hashPassword = await generateHashPassword(password);
    const randomToken = short().new();

    try {
        await createUser(userName,email,hashPassword);
        await createExpiryToken(randomToken,userName);
        const isEmailSent = sendTokenToEmail(email,randomToken);
        if(isEmailSent){
            res.status(200).send('registered successfully please check your email: ');
        }
    } catch (err) {
        if (err.errno === 1062) {
            res.status(401).send("this user has already been registered");
        }
    }


})


router.put("/verify", async (req, res, next) => {
    const {uuid} = req.body;

    const [rowData] = await getTokenRowData(uuid);

    if(!rowData){
        return res.status(404).send("token not found");
    }

    if(isTokenExpired(rowData.expiry_time)){
        return res.status(403).send("token expired please request a new token");
    }

    const isVerfied = await verifyUser(rowData.userName);

    if(isVerfied){
        await knex("token").where({userName: rowData.userName}).del();
        return res.status(200).send("you have successfully verified your account");

    }
})



router.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    const [foundUser] = await knex("users").where({ userName });

    if (!foundUser) {
        return res.status(401).send("Invalid username")
    }

    if(!foundUser.isVerfied){
        return res.status(401).send("username is not verified please verify your email address")
    }


    const checkPasswordValid = await bcrypt.compare(password, foundPassword);
    if (checkPasswordValid) {
        const token = jwt.sign({
            data: req.body
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).send({
            message: "login successfully",
            token
        })
    } else {
        res.status(401).send("Invalid password");
    }


})

module.exports = router;