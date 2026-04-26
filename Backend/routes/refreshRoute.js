const express = require("express")
const router = express.Router()
const {refreshTokenAuth} = require("../middleware/refreshTokenAuth")

router.post("/auth/refresh", refreshTokenAuth)

module.exports = router