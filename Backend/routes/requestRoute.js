const express = require('express')
const router = express.Router()
const {borrowBook,rejectRequest,acceptRequest} = require("../controller/borrowRequestController")
const Token_Verfication = require("../middleware/authMiddleware")


router.post("/borrowRequest",Token_Verfication,borrowBook)
router.put("/rejectRequest/:id",Token_Verfication,rejectRequest)
router.put("/acceptRequest/:id",Token_Verfication,acceptRequest)

module.exports = router
