const jwt = require('jsonwebtoken');

const refreshTokenAuth = async (req, res) => {
    const token = req.cookies.refreshToken
    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
            if (decoded) {
                const newAccessToken = jwt.sign(
                    { id: decoded.id, email: decoded.email, role: decoded.role },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                )
                res.status(200).json({
                    access: newAccessToken
                })
            }
        }else{
            res.status(403).json({
                message:"Refresh token is invalid or expired"
            })
        }
    } catch (error) {
            res.status(500).json({
                message:"Server error occured"
            })
    }


}
module.exports = refreshTokenAuth