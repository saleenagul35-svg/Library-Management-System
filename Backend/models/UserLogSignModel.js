const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    phone: Number,
    password: String,
    confirm: String,
    memberSince: Number
})
const signUp = mongoose.model("signUp", signUpSchema)

module.exports = signUp