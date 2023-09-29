const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const PORT = 5050;

require("dotenv").config();

//require delle routs

const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const { populate } = require("dotenv");

const app = express();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

//middleware
app.use(express.json());

app.use("/", postsRoute);
app.use("/", usersRoute);
app.use("/", loginRoute);

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Server connection error!"));
db.once("open",()=>{
    console.log("Connected MongoDb Database!");
})


app.listen(PORT, ()=>console.log("server ok"))



