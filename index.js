const express = require("express")
const { connection } = require("./config/db")
const { userRoute } = require("./routes/user")
const { cityRoute } = require("./routes/city")
const winston = require("winston");
const expressWinston = require("express-winston")
const app = express()
app.use(express.json())

app.use(expressWinston.logger({
    statusLevels:true,
    transports:[
        new winston.transports.Console({
            json:true
        }),

        new winston.transports.File({
            level:"info",
            filename:"info.log"
        }),
        
        new winston.transports.File({
            level:"error",
            filename:"error.log"
        }),
        
        new winston.transports.File({
            level:"warn",
            filename:"warn.log"
        })
    ]
}))



app.get("/",(req,res)=>{
    res.send("hello")
})

app.use("/user",userRoute)
app.use("/city",cityRoute)
// console.log([1,2,3].includes(5))




app.listen(process.env.port,async()=>{
    await connection;
    console.log("server is running")
})




