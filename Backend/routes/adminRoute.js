const express = require('express')
const router = express.Router()
const {adminVerification} = require("../controller/AdminVerificationController")

router.post("/adminVerification", adminVerification)

module.exports = router