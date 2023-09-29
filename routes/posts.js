const express = require("express");
const mongoose = require("mongoose");
const postModel = require("../models/postModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {CloudinareStorage} = require("multer-storage-cloudinary");
const crypto = require("crypto");

const post = express.Router();

const internalStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = file.originalname.split(".").pop();
		cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
	},
});

const uploads = multer({ storage: internalStorage });


post.post("/posts/uploadImg", uploads.single("image"), async (req, res) => {
	const url = req.protocol + "://" + req.get("host");
	try {
		const imgUrl = req.file.filename;
		res.status(200).json({ image: `${url}/uploads/${imgUrl}` });
	} catch (error) {
		console.error("File upload failed:", error);
		res.status(500).json({ error: "File upload failed" });
	}
});

post.get("/posts", async (req, res)=>{
    try{
     const posts = await postModel.find()
    // .populate("author", "firsName lastName")

     res.status(200).send({
        statusCode:200,
        posts:posts
     });
    }
    catch(error){
     res.status(500).send({
        statusCode:500,
        message:"Internal server Error",
        error
     });
    };
})

post.get("/posts/:postId", async(req, res)=>{
   const {postId} = req.params;

   try{
      const postById = await postModel.findById(postId);
      res.status(200).send({
         statusCode:200,
         postById
      })
   } catch(error){
      res.status(500).send({
         statusCode:500,
         message:"Internal server Error",
         error
      });
     };

})

post.post("/createpost", async (req, res)=>{
  const newPost = new postModel({
   title:req.body.title,
   content:req.body.content,
   image:req.body.image,
   author:req.body.author
  });
  try{
   const post = await newPost.save()

   res.status(201).send({
      statusCode:201,
      message:"Post saved successfully",
      payload:post,
   });

  }catch(error){
    res.status(500).send({
      statusCode:500,
      message:"Internal server Error",
      error
    });
  };

})

post.patch("/posts/id", async(req, res)=>{
   const {id} = req.params;
   const postExist = await postModel.findById(id);

   if(!postExist){
      return res.status(404).send({
         statusCode:404,
         message:`Post with id ${id} not found!`
      });
   }
   try{
      const postId = id;
      const dataToUpdate = req.body;
      const options = {new:true};

      const result = await postModel.findByIdAndUpdate(postId, dataToUpdate, options);
      res.status(200).send({
         statusCode:200,
         message:`Post with id ${id} modified successfully`,
         result
      })
   }catch(error){
      res.status(500).send({
        statusCode:500,
        message:"Internal server Error",
        error
      });
    };
})

post.delete("/posts/:id", async(req, res)=>{
   const { id } = req.params;
   const postExist = await postModel.findById(id);

   if(!postExist){
      return res.status(404).send({
         statusCode:404,
         message:`Post with id ${id} not found!`
      });
   }
   try{
      const postToDelete = await postModel.findByIdAndDelete(id);

      res.status(200).send({
         statusCode:200,
         message:`Post with id ${id} deleted successfully`
      });
   
   }catch(error){
      res.status(500).send({
        statusCode:500,
        message:"Internal server Error",
        error
      });
    };
      

})


module.exports = post;
