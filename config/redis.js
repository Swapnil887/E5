const Redis = require("ioredis")

const redis = new Redis({
    host:"redis-15627.c81.us-east-1-2.ec2.cloud.redislabs.com",
    port:15627,
    username:"default",
    password:"qsVY2ix8gpm2BLickqHoFSEfan29yCVP",
})


module.exports = {redis}


