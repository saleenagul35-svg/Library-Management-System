const express = require('express')
const router = express.Router()
const {storeBooks,fetchBooks} = require("../controller/bookController")
const Token_Verfication = require("../middleware/authMiddleware")

router.post("/addBooks",storeBooks)
router.get("/bookData",Token_Verfication, fetchBooks)

module.exports = router