const express=require('express');
const protectedMiddlewares = require('../middlewares/protected.middlewares.js');
const Post=require("../models/post.js");
const {ObjectId}=require('mongodb');
const postRouter=express.Router();

postRouter.post("/createpost",protectedMiddlewares,async(req,res,next)=>{
    try {
        const {title,body,photo}=req.body;
        console.log(title,body,photo);
        if(!title||!body||!photo){
            return res.status(400).json({error:"provide all the details!!!"});
        }
         const newPost=new Post({title,body,photo,postedBy:new ObjectId(req.users.id)});
        //  console.log(typeof req.users.id);
         console.log(newPost);
         const savedPost=await newPost.save();
         if(savedPost._id){
            return res.status(200).json({success:true,message:"posts saved successfully!!",res:savedPost});
         }
         else{
            return res.status(500).json({error:"could not able to saved post!!!"}); 


         }

        
    } catch (err) {
        return res.status(500).json({error:err.message}); 
    }
});

postRouter.get("/all-post",protectedMiddlewares,async(req,res,next)=>{
    try {
        const result=await Post.find({}).populate('postedBy','_id name email').populate('comment.postedBy','_id name');
        return res.status(200).send({success:true,result});

        
    } catch (err) {
        return res.status(500).json({error:err.message}); 
    }
});

postRouter.get("/my-post/specific",protectedMiddlewares,async(req,res,next)=>{
    try {
        const userSpecificPost=await Post.find({postedBy:new ObjectId(req.users.id)});
        
        return res.status(200).json({message:"sent successfully!!",result:userSpecificPost});
        
    } catch (err) {
        return res.status(500).json({error:err.message}); 
    }
})

postRouter.put("/likes/:postId",protectedMiddlewares,async(req,res,next)=>{
    const {id}=req.users;
    console.log(id,'likes');
    try {
        console.log(req.params.postId,'likes waala post');
        const updatedPost=await Post.findByIdAndUpdate(req.params.postId,{
            $addToSet:{likes:id}
        },{new:true}).exec();
        if(!updatedPost){
            return res.status(404).json({error:"post not found"});
        }
    
        console.log('likes added successfully');
        
        return res.status(201).json({success:true,result:updatedPost});

        
    } catch (error) {
        return res.status(500).json({error:"Internal server error"});

        
    }
    
    });

postRouter.put("/un-likes/user/:postId",protectedMiddlewares,async(req,res,next)=>{
        const {id}=req.users;
        console.log(id,'hai na');
        try {
            const updatedPost=await Post.findByIdAndUpdate(req.params.postId,{
                $pull:{likes:id}
            }).exec();
            if(!updatedPost){
                return res.status(404).json({error:"post not found"});
            }
            
            return res.status(201).json({success:true,result:updatedPost});
    
            
        } catch (error) {
            return res.status(500).json({error:"Internal server error"});
    
            
        }
        
        });

 postRouter.put("/comments/user/posts/:postId/:text",protectedMiddlewares,async(req,res,next)=>{
            const {id}=req.users;

            console.log(id,'comments');
            const {text}=req.params;
            console.log(text,'req.body.text'); 
            const comment={
                text:text,
                postedBy:id
            }
            try {
                console.log(req.params.postId,'comment waala post');
                const updatedPost=await Post.findByIdAndUpdate(req.params.postId,{
                    $addToSet:{comment:comment}
                },{new:true}).populate('comment.postedBy','_id name').exec();
                if(!updatedPost){
                    return res.status(404).json({error:"post not found"});
                }
                console.log('comments added successfully');
                
                return res.status(201).json({success:true,result:updatedPost});
                
            } catch (error) {
                console.error(error);
                return res.status(500).json({error:"Internal server error"});
            }
            
            });
    

postRouter.delete("/delete-post/:postId",protectedMiddlewares,async(req,res,next)=>{
    const {postId}=req.params;
    try {
        //first vrify's whether the post is of users or not
        const verifyPOst=await Post.findOne({_id:new ObjectId(postId)});
        console.log(verifyPOst);
        console.log(typeof verifyPOst.postedBy.toString()   );
        console.log(typeof req.users.id);
        if(verifyPOst.postedBy.toString()!==req.users.id){
            return  res.json({success:false,message:"You can not delete other's posts!!!"});
        }
       const result= await Post.deleteOne({_id:new ObjectId(postId)});
       if(result.deletedCount>0){
        return res.status(200).json({success:true,message:"post deleted successfully!!!"})
       }
       else{
        return res.status(400).json({success:false,message:"failed to delete"})
       }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error!!!"})

    }
})

module.exports=postRouter;