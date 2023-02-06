const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
require("dotenv").config()
const {UserModel}=require("../models/user.model")
const {authenticate}=require("../middlewares/authenticate.middleware")
const fs=require("fs")

const userRouter=express.Router()

userRouter.get("/",(req,res)=>{
    res.send("All Good")
})

userRouter.post("/signup",async (req,res)=>{
    const {name,email,password,role}=req.body
    try {
        bcrypt.hash(password,5,async (err,secure_password)=>{
            if(err){
                console.log(err);
            }else{
                const user=new UserModel({email,password:secure_password,name,role})
                await user.save()
                res.send({"msg":"Registered"})
            }
        })
       
    } catch (error) {
        res.send("Error While Registering")
        console.log(error)
    }
    
})

userRouter.post("/login", async (req,res)=>{
    let {email,password}=req.body
    try {
        const user=await UserModel.find({email:email})
        // console.log(user)
        
        if(user.length>0){
            const hash_pass=user[0].password
            bcrypt.compare(password,hash_pass, (err, result)=> {
                if(result){
                    var token = jwt.sign({userID:user[0]._id, role:user[0].role} , process.env.normalKey,{expiresIn:"1m"});
                    const refresh_token=jwt.sign({userID:user[0]._id} , process.env.refreshKey,{expiresIn:"5m"});
                    res.send({"msg":"login Sucessful","token":token,"refresh":refresh_token})
                }else{
                    res.send({"msg":"Wrong Credentials"})
                }
            });
            
        }else{
            res.send("Wrong credentials")
        }      
    } catch (error) {
        console.log(error)
    }
})


userRouter.get("/newtoken",(req,res)=>{
    let refreshToken=req.headers.authorization
   if(refreshToken){
        try {
            const decoded=jwt.verify(refreshToken,process.env.refreshKey)
                const userID=decoded.userID
                const newToken=jwt.sign({userID},process.env.normalKey,{expiresIn:"1m"})
                res.send({"msg":"new token",token:newToken})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }

   }else{
      res.send("Please Login First")
   }
    
})

userRouter.get("/logout",(req,res)=>{
    const token=req.headers.authorization;
    const blacklistedData=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
     blacklistedData.push(token)
     fs.writeFileSync("./blacklist.json",JSON.stringify(blacklistedData))
     res.send("logged out Sucessfully")
})

module.exports={
    userRouter
}