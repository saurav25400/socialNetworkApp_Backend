const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const protectedMiddlewares = require("../middlewares/protected.middlewares.js");

const User = require("../models/user.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req.body.name);
  return res.status(200).send("working correctly!");
});

router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "please provide all the information." });
    }
    const savedUser = await User.findOne({ email: email });
    if (savedUser) {
      return res.status(400).json({ message: "email already exists!!" });
    }
    const hashedPasssword = await bcrypt.hash(password, 10);
    console.log(hashedPasssword);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPasssword,
    });
    const result = await newUser.save();
    console.log(result);
    return res
      .status(200)
      .send({ success: true, message: "user registered successfully!" });
  } catch (error) {
    return res.status(400).send({ message: "something went wrong!!" });
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const savedUser = await User.findOne({ email: email });
    if (!savedUser) {
      return res
        .status(400)
        .send({ error: "email or password is incorrect!!" });
    }
    const match = await bcrypt.compare(password, savedUser.password);
    if (match) {
      const { _id, name, email } = savedUser;

      const token = jwt.sign(
        { email: savedUser.email, id: savedUser._id },
        "MubrGreNhDggODBu2YasC03mRpM8N7NP",{ expiresIn: '1d' }
      );
      console.log(token,'signin');
      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60*1000,secure: process.env.NODE_ENV === 'production', // Set secure to true in production
      sameSite: 'strict', });
      return res
        .status(200).json({
          success: true,
          message: "user loggedin successfully!!",
          user: { _id, name, email }
        });
    } 
    else {
      return res
        .status(400)
        .send({ success: false, message: "email or password is incorrect!!" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "email or password is incorrect!!" });
  }
});

router.get("/check", protectedMiddlewares, (req, res, next) => {
  return res.json({ message: "check in message" });
});


router.post("/logout",(req,res,next)=>{
  res.clearCookie('token',{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure this matches your cookie setup
    sameSite: 'strict'
  });
  return res.status(200).json({success:true,message:'user logged out  successfully!!!'});
})

module.exports = router;
