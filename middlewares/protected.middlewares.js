const jwt=require('jsonwebtoken');
const protectedMiddlewares=(req,res,next)=>{
    try {
        // console.log('tokenjkldgjk');
        const token = req.cookies.token;
        console.log(token,'dpubt hai');
        if(!token){
            return res.status(401).json({error:"anuthorised access!"});
        }
        let payload = jwt.verify(token,"MubrGreNhDggODBu2YasC03mRpM8N7NP");
        if(!payload){
            return res.status(401).json({error:"anuthorised access!"});
        }
        // console.log(payload);
        req.users=payload; //users={email:email,id:_id};
        next(); 
    } catch (error) {
        return res.status(401).json({error:"anuthorised access!"});
    }
}

module.exports=protectedMiddlewares;