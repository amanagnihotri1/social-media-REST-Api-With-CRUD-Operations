const router=require("express").Router();
const Post=require("../models/post");
//creating a post
router.post("/",async(req,res)=>
{
  const newPost=new Post(req.body);
  try
  {
    const savedPost= await newPost.save();
    res.status(200).json("saved new post");
  }catch(err)
  {
      res.status(500).json(err);
  }
});
router.put("/:id",async(req,res)=>
{ 
  try
  {
  const post=await Post.findById(req.params.id);
   if(post.userId===req.body.userId)
   {
     await post.updateOne({$set:req.body});
     res.status(200).json("Post has been updated");
   }
   else
   {
     res.status(403).json("You can update your post only");
   }
  }catch(err)
  {
    res.json(err);
  } 
});
router.delete("/:id",async(req,res)=>
{ 
  try
  {
  const post=await Post.findById(req.params.id);
   if(post.userId===req.body.userId)
   {
     await post.deleteOne();
     res.status(200).json("Post has been deleted");
   }
   else
   {
     res.status(403).json("You can delete your post only");
   }
  }catch(err)
  {
    res.json(err);
  } 
});
router.put("/:id/like",async(req,res)=>
{
  try
  {
  const post=await Post.findOne(req.params.id);
  if(!post.likes.include(req.body.userId))
  {
    await post.updateOne({$push:{likes:req.body.userId}});
  }
  else
  {
    await post.updateOne({$pull:{likes:req.body.userId}});
    res.status(200).json("Like have beem removed from post");
  }
  }catch(err)
  {
    res.status(500).json(err);
  }
})
router.get("/:id",async(req,res)=>
{ try
  {  
   const post=await Post.findById(req.params.id);
   res.status(200).json(post);
  }catch(err)
  {
    res.status(500).json(err);
  }
  })
  router.get("/timeline/all",async(req,res)=>
  {
    const postArray=[];
    try{
      const currentUser=await User.findById(req.body.userId);
      const userPost=await Post.find({userId:currentUser._id});
      const friendPosts=await Promise.all(
        currentUser.following.map((friendId)=>
        {
        return  Post.find({userId:friendId});
    })
  );
    res.json(userPost.concat(...friendPosts))
  }catch(err)
    {
      res.status(500).json(err);
    }
  })
module.exports=router;