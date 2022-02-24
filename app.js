const dotenv=require("dotenv").config();
const express=require("express");
const morgan=require("morgan");
const mongoose=require("mongoose")
const helmet=require("helmet");
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const postRoute=require("./routes/Post");
const app=express(); 
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log("server connected");
});
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
  app.use("/api/user",userRoute);
  app.use("/api/auth",authRoute);
  app.use("/api/posts",postRoute);
app.listen(process.env.PORT,()=>console.log("Server started at port:3000"));