const jwt = require('jsonwebtoken');
const Token_Verfication = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (token) {

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            if (decoded) {
                if (decoded.role === "user") {
                    req.ActiveEmail = decoded.email
                    req.ActiveID = decoded.id

                    next();
                }
                if (decoded.role === "admin") {
                     req.ActiveID = decoded.id
                    next();
                }
            }
            else {
                res.status(401).json({
                    message: "request Denied"
                })
            }

        } else {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    } catch (error) {
        res.status(401).json({ message: "token not found" })
    }


}
module.exports = Token_Verfication