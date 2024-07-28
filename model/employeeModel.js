const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
    _id: String,
    name: String,
    phoneNumber: String,
    email: String,
    position: String,
    salary: Number,
    experience: Number,
    employedSince: { type: Date, default: Date.now() },
    isCurrentlyEmployed: { type: Boolean, default: true },
    lastDate: { type: Date, default: null },
    password: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
}, {collection: "employee", versionKey: false});

module.exports = mongoose.model("employee", employeeSchema)