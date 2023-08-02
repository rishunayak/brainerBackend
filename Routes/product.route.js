const express=require("express")
const Product=require("../Model/product.model")
const Authentication = require("../Middleware/Authentication")
const multer = require('multer');
const path = require('path');

const app=express.Router()
 

app.use(Authentication) // middleware for authorization

app.post("/",async(req,res)=> 
{
   

    try
    {
        await Product.create({...req.body}) 
        res.send({message:"Product Add Successfully",status:1})  
    }
    catch(e)
    {
       
        res.send({message:e.message,status:0})
    }
})


app.get("/",async(req,res)=>
{
    let {page,sort,search}=req.query
    const searchRegex = new RegExp(search, 'i');
    
    try
    {
        let totalPage = await Product.countDocuments({ name: searchRegex }); 
        totalPage=Math.ceil(totalPage/10)
        let sortOrder={}
        if(sort=="asc")
        {
            sortOrder={price:1}
        }
        else if(sort=="desc")
        {
            sortOrder={price:-1}
        }
        
  
        
         const products = await Product.find({ name: searchRegex })
         .sort(sortOrder)
         .skip((page-1)*10)
         .limit(10);
         
         res.send({data:{totalPage,products,currentPage:page},status:1,message:"Request successfully"})  
       
    }
    catch(e)
    {
        res.send({message:e.message,status:0})
    }
})

app.patch("/:id",async(req,res)=>
{
    const product=req.body 
    const id=req.params.id

    try
    {
       let d= await Product.findOneAndUpdate({_id:id},{...product})
       
        res.send({status:1,message:"Product Updated Successfully"})
    }
    catch(e)
    {
   
        res.send({message:e.message,status:0})
    }
    
})

app.delete("/:id",async(req,res)=>
{
    let id=req.params.id
    try
    {
        await Product.findOneAndDelete({_id:id})
        res.send({message:"Product Deleted Successfully",status:1})
    }
    catch(e)
    {
        res.send({message:e.message,status:0})
    }
})

module.exports=app