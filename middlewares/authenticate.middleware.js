
const jwt=require("jsonwebtoken")
require("dotenv").config()
const fs=require("fs")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization
    const blacklistedData=JSON.stringify(fs.readFileSync("./blacklist.json","utf-8"))

     if(token){
            if(blacklistedData.includes(token)){
                res.send("Login Again")
                return
            }
         const decoded=jwt.verify(token,process.env.normalKey)
         if(decoded){
            const userID=decoded.userID
            req.body.userID=userID
            req.body.role=decoded.role
            next()
         }else{
            res.send("Please Login First")
         }
     }else{
        res.send({"msg":"Login First"})
     }
}

module.exports={
    authenticate
}