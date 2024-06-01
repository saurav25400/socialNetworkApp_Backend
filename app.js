const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')
const dbConnection=require('./config.js');
const router=require('./routes/authens.js');
const postRouter=require("./routes/post.js");
const userRouter=require('./routes/user.js');



const app=express();
const PORT=process.env.PORT||5000;
// app.use(express.json());

app.use(express.urlencoded({extended:true}));
// app.use(bodyParser.urlencoded({ extended: true }));
// // parse application/json
app.use(bodyParser.json())
app.use(cookieParser());

const corsOptions = {
    origin: 'https://main--thesocialnetworkapp.netlify.app/', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };
app.use(cors(corsOptions));

app.get('/',(req,res,next)=>{
    res.send('welcome to express server.');
});

app.use('/api/user',router);
app.use("/api/posts",postRouter);
app.use("/api/userDetails",userRouter);

//alternate options for cors policy that we can use it here.

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.listen(PORT,()=>{
    dbConnection();
    console.log('server is listenign at port '+PORT);
})
