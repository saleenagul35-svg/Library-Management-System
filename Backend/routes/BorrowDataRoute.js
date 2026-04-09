const express = require('express')
const router = express.Router()
const {adminNotification,UserpendingRequestData,requestCount,approvedRequestCount,overDueCount,membersActivity} = require("../controller/BorrowDataController")
const Token_Verfication = require("../middleware/authMiddleware")

router.get("/adminNotification",Token_Verfication,adminNotification)
router.get("/UserpendingRequestData",Token_Verfication,UserpendingRequestData)
router.get("/requestCount",Token_Verfication,requestCount)
router.get("/approvedRequestCount",Token_Verfication,approvedRequestCount)
router.get("/overDueCount",Token_Verfication,overDueCount)
router.get("/membersActivity",Token_Verfication,membersActivity)
module.exports = router