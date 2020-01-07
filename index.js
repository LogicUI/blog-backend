const knex = require("./db");
const cors = require("cors");
const express = require("express");
const authRoute = require("./routes/auth-route");
const mailRoute = require("./routes/mail");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth",authRoute);
app.use("/email",mailRoute);

const verifyToken = ((req,res,next) => {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        req.token = bearerToken;
        next()
    }else {
        res.sendStatus(403);
    }
})


app.listen(PORT,()=> {
    console.log(`listening to port ${PORT}`);
});