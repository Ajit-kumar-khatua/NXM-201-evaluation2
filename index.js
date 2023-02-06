
const express=require("express")
const { connection } = require("./config/db")
const { authenticate } = require("./middlewares/authenticate.middleware")
const { userRouter } = require("./routes/user.route")
const { authorize } =require("./middlewares/authorize.middleware")
require("dotenv").config()

const app=express()
app.use(express.json())
app.use("/users",userRouter)
app.use(authenticate)


app.get("/goldrate",(req,res)=>{
    res.send("Gold rate end Point.....")
})

app.get("/userstats",authorize(["manager"]),(req,res)=>{
    res.send("User status end point...")
})

app.listen(process.env.port , async ()=>{
    try {
        await connection
        console.log("Connevted to DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running at ${process.env.port}`)
})