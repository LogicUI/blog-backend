require("dotenv").config();
const knex = require("knex")({
    client:"mysql",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE
    }
})

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// })

// connection.connect(function(err){
//     if(err) {
//         return console.error("error" + err.message);
//     }
//     console.log("Connected to MySQL server");
// })



module.exports = knex;