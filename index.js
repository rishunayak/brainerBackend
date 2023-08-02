require("dotenv").config()

const express=require("express")
const cors=require("cors")
const connect=require("./Config/Config")
const products =require("./Routes/product.route")
const user=require("./Routes/user.route")
//routes


const app=express()

app.use(express.json())
app.use(cors())

app.use("/users",user)
//route use
app.use("/products",products)





app.get("/",(req,res)=>
{
    res.send("Welecome to server")
})


app.listen(process.env.PORT,async()=>
{
    await connect
    console.log("Server started")
})