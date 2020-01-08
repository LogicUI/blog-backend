const knex = require ("../db");
const moment = require("moment");
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer");

const getTokenRowData = async (uuid)  => {
    return  await knex("token")
    .where({uuid})
 
}

const isTokenExpired = (expiry_time) => {
    const timeDifference = moment().diff(moment(expiry_time),"minutes");
    return timeDifference > 15;
}


const verifyUser = async(userName) => {
    return await knex("users")
    .where({userName})
    .update({isVerified:true})
}


const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const createUser = async (userName,email, hashPassword) => {

    return await knex("users").insert({
        userName,
        email,
        password: hashPassword,
    });
}

const createExpiryToken  = async (randomToken,userName) => {
   return await knex("token").insert({
        uuid: randomToken,
        userName,
        expiry_time: moment().add(15,"minutes").format("YYYY-MM-DD HH:mm:ss")
    })

}

const sendTokenToEmail = async (email,randomToken) => {
    const mailOptions = {
        from: process.env.EMAIL_HOST,
        to: `${email}`,
        subject: "verify your email",
        text: `localhost:3000/verify/${randomToken}`
    }

    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        port: 587
    })
    


    smtpTransport.sendMail(mailOptions, (error, result) => {
        if (error) {
            return error;
        } else {
            return result;
        }
    })
}

module.exports = {
    getTokenRowData,
    isTokenExpired,
    verifyUser,
    generateHashPassword,
    createUser,
    createExpiryToken,
    sendTokenToEmail
}