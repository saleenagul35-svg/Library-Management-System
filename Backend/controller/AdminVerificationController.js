const adminVerify = require("../models/AdminVerificationModel")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
require("dotenv").config()
const adminVerification = async (req, res) => {
    const { email, password } = req.body

    try {

        const testAdmin = await adminVerify.findOne({ email: email })

        if (testAdmin) {
            const testadminPass = await bcrypt.compare(password, testAdmin.password)
            if (testadminPass) {
                const accessToken = jwt.sign(
                    { id: testAdmin._id, email: testAdmin.email, role: "admin" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                )


                res.status(200).json({
                    message: "Admin verified",
                    accessToken: accessToken
                })
            } else {
                res.status(401).json({
                    message: "incorrect email or password "
                })

            }
        } else {
            res.status(401).json({
                message: "incorrect email or password "
            })


        }

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error occured"
        })
    }
}

module.exports = {adminVerification}