const { redis } = require("../config/redis")
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../model/user.model");
require("dotenv").config()

const authenticate = async (req,res,next)=>{
    const token = req.headers.authorization
    try {
       var bt = await redis.get("blacklisttoken")
       var Bt = JSON.parse(bt)
       console.log(bt) 
       console.log(Bt)
       if(Bt.includes(token))
       {
       return res.send("you have to login first");
       }

       jwt.verify(token,process.env.tokenKey,async (err,result)=>{
        if(err){
            res.send({err:err.message})
        }else{
            const {email} = result;
            const data = await Usermodel.find({email})
            req.body.email = email;
            req.body.userId = data[0]._id;
            next()
        }
       })
       
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


module.exports = {authenticate}

