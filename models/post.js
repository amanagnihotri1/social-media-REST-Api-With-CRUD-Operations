const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
userId:{
    type:String,
    required:true
},
desc:{
 type:String,
 max:500
},
img:
{
    type:String
},
likes:
{
    type:Array,
    default:[]
}
},
{ timestamps:true }        
);
const posts=mongoose.model('posts',postSchema);
module.exports=posts;