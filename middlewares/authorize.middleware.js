

const authorize=(userrole)=>{
    return (req,res,next)=>{
        const role=req.body.role
        if(userrole.includes(role)){
           next()
        }else{
            res.send("Not Authorize")
        }
    }
}

module.exports={
    authorize
}