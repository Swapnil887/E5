const express = require("express");
const { authenticate } = require("../middleware/authenticate");
var https = require('https');
const { redis } = require("../config/redis");
const { Citymodel } = require("../model/city.model");
const { validate } = require("../middleware/validate");
const cityRoute = express()


cityRoute.get("/:ip", authenticate,validate,async (req, res) => {
    const ip = req.params.ip;
    const {email,userId} = req.body
    var ad = await redis.get(ip)
    if(ad)
    {
        var k = JSON.parse(ad)
        console.log("cash")
       return res.send({datafromcash:k})
    }

    const options = {
        path: `/${ip}/json/`,
        host: 'ipapi.co',
        port: 443,
        headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
    };
    https.get(options, async function (resp) {
        var body = ''
        resp.on('data', function (data) {
            body += data;
        });

        resp.on('end',async function () {
            var loc = JSON.parse(body);
            redis.set(ip,JSON.stringify(loc),"EX",60*6)
            var x = await Citymodel.find({userId})
            if(x.length==0)
            {
                var b =  Citymodel({userId,email,previouscity:[{city:loc.city,ip}]});
                var df = await b.save();
                console.log(df)
            }else{
                var l = x[0].previouscity;
                l.push({city:loc.city,ip})
                console.log(l)
                var as = await Citymodel.updateOne({userId},{previouscity:l})
                console.log(as);
            }
            console.log(x)
            res.send(loc);
        });
    });
})

module.exports = { cityRoute }