const express = require('express')
const router = express.Router()
const {adminNotification,UserpendingRequestData,requestCount} = require("../controller/BorrowDataController")
const Token_Verfication = require("../middleware/authMiddleware")

router.get("/adminNotification",Token_Verfication,adminNotification)
router.get("/UserpendingRequestData",Token_Verfication,UserpendingRequestData)
router.get("/requestCount",Token_Verfication,requestCount)
module.exports = router