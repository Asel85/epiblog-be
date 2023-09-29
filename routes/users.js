const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userModel = require("../models/usersModel");

const user = express.Router();

user.get("/users", async(req, res)=>{
    try{
        const users = await userModel.find();
        res.status(200).send({
            statusCode:200,
            users
        });
    }
    catch(error){
     res.status(500).send({
        statusCode:500,
        message:"Internal server error",
        error
     });
    }
});

user.get("/users/:id", async(req, res)=>{
    const { id } = req.params;
    try{
        const userExist = await userModel.findById(id);

        if(!userExist){
            res.status(404).send({
                statusCode:404,
                message:`User with id ${id} doesn't exist!}`
            })
        };

        res.status(200).send({
            statusCode:200,
            userExist
        });
    }catch(error){
        res.status(500).send({
           statusCode:500,
           message:"Internal server error",
           error
        });
       }
})

user.post("/users/create", async (req, res)=>{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = await userModel.findOne({ email: req.body.email });
	if (user) {
		return res.status(400).send({
			statusCode: 400,
			message: "Email already exist!",
		});
	}


    const newUser = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword
  });
  try{
    const user = newUser.save();
    res.status(201).send({
        statusCode:201,
        message:"User saved successfully!",
        user
    });
  }
  catch(error){
    res.status(500).send({
        statusCode:500,
        message:"Internal server error",
        error
     });
  }
});

user.patch("/users/:id", async(req, res)=>{
    const {id} = req.params;

    try{
        const userExist = await userModel.findById(id);

        if(!userExist){
            res.status(404).send({
                statusCode:404,
                message:`User with id ${id} doesn't exist!}`
            })
        };
        
        const userId = id;
        const dataToUpdate = req.body;
        const options = {new: true};

        const result = await userModel.findByIdAndUpdate(
            userId,
            dataToUpdate,
            options
        );
        res.status(200).send({
            statusCode:200,
            userExist
    })
} catch(error){
    res.status(500).send({
        statusCode:500,
        message:"Internal server error",
        error
     });
  }
});

user.delete("/users/:id", async(req, res)=>{
    const { id } = req.params;

    try{
        const userExist = await userModel.findById(id);

        if(!userExist){
            res.status(404).send({
                statusCode:404,
                message:`User with id ${id} doesn't exist!}`
            })  
         }

         const userToDelete = await userModel.findByIdAndDelete(id);
         res.status(200).send({
            statusCode:200,
            message:`Post with id ${id} deleted successfully`
         });
        }catch(error){
            res.status(500).send({
                statusCode:500,
                message:"Internal server error",
                error
             });
          }
})


module.exports = user