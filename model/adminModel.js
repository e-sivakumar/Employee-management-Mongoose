const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    _id: String,
    name: String,
    userName: String,
    password: String
}, {collection:"admin", versionKey: false})

module.exports = mongoose.model("admin", adminSchema)