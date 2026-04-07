const express = require('express')
const router = express.Router()
const {borrowBook} = require("../controller/borrowRequestController")
const Token_Verfication = require("../middleware/authMiddleware")


router.post("/borrowRequest",Token_Verfication,borrowBook)



module.exports = router
