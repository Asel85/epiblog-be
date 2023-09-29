const mongoose = require("mongoose");

const PostModelSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
       // type:mongoose.Schema.Types.ObjectId,
       // ref:"User"
    },

},

{ timestamps:true, strict:true }

);

module.exports = mongoose.model("Post", PostModelSchema, "posts")