const bcrypt=require("bcrypt");
const router=require("express").Router()
const userinfo=require("../models/user.js");
router.post("/register", async(req,res)=>
{ 
  try
  {
    const salt= await bcrypt.genSalt(20);
const hashedPass = await bcrypt.hash(req.body.password,salt);
  const newUser=await new userinfo(
  {
    username:req.body.username,
    email:req.body.email,
    password:hashedPass,
});
const user=await newUser.save();
res.status(200).json(user);
}catch(err){ console.log(err);}
});
router.post("/login",async(req,res)=>
{ 
  try
  {
  const user=await userinfo.findOne({email:req.body.email});
  !user && res.status(404).json("user not found");
  const validatePass=await bcrypt.compare(req.body.password,userinfo.password)
  !validatePass && res.status(400).json("wrong password");
}catch(err){console.log(err);}
});
module.exports=router;