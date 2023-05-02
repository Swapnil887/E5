const express = require("express")
require("dotenv").config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../model/user.model");
const { redis } = require("../config/redis");

const userRoute = express()

userRoute.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const data = await Usermodel.find({email})

        if(data.length!=0)
        {
            return res.send("user already register")
        }

        const encrypt_password =await bcrypt.hash(password,5);
        const obj = {name,email,password:encrypt_password}
        var x = Usermodel(obj);
        var y = await x.save()
        res.send(y)

    } catch (error) {
        console.log("error")
        res.send("something went wrong in register")
    }
})

userRoute.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        var data = await Usermodel.find({email})
        if(data.length==0)
        {
           return res.send("you have to register first")
        }
        
        bcrypt.compare(password,data[0].password,async (err,result)=>{
            if(err){
                res.send({error:err.message})
            }else{
                if(result){
                  var  token =  await jwt.sign({email},process.env.tokenKey)
                  res.send({token})
                }else{
                    res.send("wrong credentials")
                }
            }
        })
        
    } catch (error) {
        console.log(error)
        res.send("something went wrong in login ")
    }
})


userRoute.post("/logout",async(req,res)=>{
    const token = req.headers.authorization
    try {
        
        var x = await redis.get("blacklisttoken")
        var y = JSON.parse(x)
        y.push(token)
        console.log(y)
        await redis.set("blacklisttoken",JSON.stringify(y))
        res.send("logout")
    } catch (error) {
        console.log(error)
        res.send("something went wrong in logout");
    }
})

module.exports = {userRoute}