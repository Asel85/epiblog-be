const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/usersModel");
const user = require("./users");

login.post("/login", async(req, res)=>{
    const user = await userModel.findOne({email:req.body.email});

    if(!user){
        res.status(404).send({
            statusCode:404,
            message:"User not found!"
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        res.status(400).send({
            statusCode:400,
            message:"Password is invalid"
        })
    }

    res.status(200).send({
        statusCode:200,
        message:"Login successfully",
        user
    });
})

module.exports = login