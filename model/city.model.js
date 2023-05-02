const mongoose = require("mongoose")

const citySchema = mongoose.Schema({
    userId:String,
    email:String,
    previouscity:[]
})

const Citymodel = mongoose.model("city",citySchema)

module.exports = {Citymodel}