const express=require("express")
const bcrypt=require("bcrypt")
const app=express.Router()
const jwt=require("jsonwebtoken")
const User = require("../Model/user.model")
const Authentication = require("../Middleware/Authentication")

app.post("/register",async(req,res)=>
{
    const {email,password,name}=req.body

    try
    {
         const exist=await User.findOne({email:email})

         if(exist)
         {
            res.send({message:"User Already Registered",status:0})
         }
         else
         {
            bcrypt.hash(password,5,async(err,hashPassword)=>
            {
                if(err)
                {
                    res.send(err)
                }
                else
                {
                    try
                    {
                        await User.create({email,password:hashPassword,name})
                        res.send({message:"Successfully Registered",status:1})
                    }
                    catch(e)
                    {
                        res.send({message:e.message,status:0})
                    }
                }
            })
         }

    }
    catch(e)
    {
        res.send({message:e.message,status:0})
    }
})


app.post("/login",async(req,res)=>
{
    const {email,password}=req.body

    try
    {
        const exist=await User.findOne({email:email})

        if(exist)
        {
            bcrypt.compare(password,exist.password,function(err,result)
            {
                if(result)
                {
                    const token=jwt.sign({id:exist.id},"auth", {expiresIn:"1h"})
                    res.send({token:token,message:"Login Successfull",status:1})
                }
                else
                {
                    res.send("Wrong Credntials")
                }
            })
           
        }
        else
        {
            res.send({message:"Email doesn't Exist",status:0})
        }
    }
    catch(e)
    {
        res.send({message:e.message,status:0})
    }
})

app.get("/",async(req,res)=>
{
  const token=req.headers.token

  jwt.verify(token,"auth",(err,decorded)=>
  {
 
      if(err)
      {
          res.send({message:"login expired",status:0,token:""})
      }
      else
      {
          const id=decorded.id
          res.send({token:token,message:"Login Successfull",status:1})
       
      }
  })


})




module.exports=app
