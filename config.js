const mongoose=require('mongoose');


async function dbConnection(){
    try {
        await mongoose.connect(process.env.MONGO_DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("connected to mongodb succesfully!!!");
        
    } catch (error) {
        console.log("error while connecting to mongodb atlas.");
        
    }
}
module.exports= dbConnection;