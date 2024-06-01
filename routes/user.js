const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const protectedMiddlewares = require("../middlewares/protected.middlewares.js");

const User = require("../models/user.js");

const Post=require("../models/post.js");

const userRouter=express.Router();

userRouter.get("/user/:id",protectedMiddlewares,async(req,res,next)=>{
    try {
        const {id}=req.params;
        console.log(id);
         const user=await User.findOne({_id:id});
         if(!user){
            return res.status(400).json({success:false,message:"user not found!!!"});

         }
         
        const response=await Post.find({postedBy:id}).populate("postedBy","_id name email");

        return res.status(200).json({success:true,result:response});
        
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"}); 
    }
})

userRouter.put("/follow/:followId",protectedMiddlewares,async(req,res,next)=>{
    try {
        const {followId}=req.params;
        
        console.log(followId,'hllll');
        const result=await User.findByIdAndUpdate(followId,{
            $addToSet:{follower:req.users.id}
        },{new:true});
        if(result._id){
          const response=await User.findByIdAndUpdate(req.users.id,{
                $addToSet:{following:followId}
            },{new:true}).select("-password");
            return res.status(200).json({success:true,result:response});

        }
        else{
            return res.status(404).json({success:false,message:"something is wrong"});
        }
        console.log(result,'badehega');
        return res.json({success:true,message:"yes"});
    } catch (error) {
        console.log(error);
        
    }
})


userRouter.put("/un-follow/:followId",protectedMiddlewares,async(req,res,next)=>{
    try {
        const {followId}=req.params;
        
        console.log(followId);
        const result=await User.findByIdAndUpdate(followId,{
            $pull:{follower:req.users.id}
        },{new:true});
        if(result._id){
          const response=await User.findByIdAndUpdate(req.users.id,{
                $pull:{following:followId}
            },{new:true}).select("-password");
            return res.status(200).json({success:true,result:response});

        }
        else{
            return res.status(404).json({success:false,message:"something is wrong"});
        }
        console.log(result,'badehega');
        //return res.json({success:true,message:"yes"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error!!!    "});

        
    }
});

userRouter.get("/get-all-details/:followId",protectedMiddlewares,async(req,res,next)=>{
    try {

        const {followId}=req.params;

        console.log(followId);
        const response=await User.findById(followId).select("-password");
        if(response._id){
            return res.status(200).json({success:true,result:response});
        }
        else{
            return res.status(400).json({success:false,message:"user not found!!!"});
        }
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error!!!"});
    }
})

userRouter.get("/get-myself/user-details/fetch-user",protectedMiddlewares,async(req,res,next)=>{
    try {
        const response=await User.findById(req.users.id).select("-password");
        if(response._id){
            return res.status(200).json({success:true,result:response});
        }
        else{
            return res.status(400).json({success:false,message:"user not found!!!"});
        }
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error!!!"}); 
    }
})





module.exports=userRouter;

