
const mysql = require("mysql");
const sqllite3 = require("sqlite3").verbose();
require("dotenv").config();

let connection;
if (process.env.NODE_ENV === "local") {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })

    connection.connect(function (err) {
        if (err) {
            return console.error("error" + err.message);
        }
        console.log("Connected to MySQL server");
    })

} else if (process.env.NODE_ENV === "test") {
    connection = new sqllite3.Database(":memory:", (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the in-memory sqllite database")
    });
}




module.exports = connection;