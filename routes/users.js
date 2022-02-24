const User=require("../models/user");
const router=require("express").Router();
//updating user_info
router.put("/:id",async(req,res)=>{ 
if(req.body.userId===req.params.id || req.body.isAdmin)
{
if(req.body.password)
{
    try
   {
        const salt=await bcrypt.genSalt(20);
        req.body.password=await bcrypt.hash(req.body.password,salt);  
      }catch(err)
      {
          return res.sendStatus(500).json(err);
      }
  }
try
{
    const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body,
    });
    res.status(200).json("account has been updated");
 }catch(err)
 {
     return res.send(500).json(err);
 }
}
else
{
  return res.sendStatus(403).json("You can update your account only");
}
});
//Deleting User
router.delete("/:id",async(req,res)=>{ 
 if(req.body.userId === req.params.id || req.body.isAdmin)
   { 
   try
    {
        await User.deleteOne(req.params.id);
       return res.status(200).json("account has been deleted");
     }catch(err)
     {
         return res.send(500).json(err);
     }
}
else
{
    return res.status(403).json("You cannot delete account");
}
});
//Getting User
router.get("/:id",async(req,res)=>
{
    try{
        const user=await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc;
        res.status(200).json(user);
    }catch(err)
    {
        res.json(err);
    }
});
router.put("/:id/follow",async(req,res)=>
{
    if(req.body.userId!== req.params.id)
    {
     try
     {
        const user=await User.findById(req.params.id);
        const connectedUser=await User.findById(req.body.userId);
        if(!user.followers.include(req.body.id))
        {
           await user.updateOne({$push:{followers:req.body.userId}});
          await user.updateOne({$push:{following:req.body.userId}});
        res.status(200).json("User has been followed");
        }
        else
        {
            res.status(403).json("you already follow this user");
        }
       
    }catch(err)
     {
         res.json(err);
     }
    }
else
{
    res.status(403).json("You Can't follow yourself");
}
});
router.put("/:id/unfollow",async(req,res)=>
{
    if(req.body.userId!== req.params.id)
    {
     try
     {
        const user=await User.findById(req.params.id);
        const connectedUser=await User.findById(req.body.userId);
        if(user.followers.include(req.body.id))
        {
           await user.updateOne({$pull:{followers:req.body.userId}});
          await user.updateOne({$pull:{following:req.body.userId}});
        res.status(200).json("User has been followed");
        }
        else
        {
            res.status(403).json("you already follow this user");
        }
       
    }catch(err)
     {
         res.json(err);
     }
    }
else
{
    res.status(403).json("You Can't follow yourself");
}
});
module.exports=router;