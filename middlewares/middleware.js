require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403)
        const userData = await User.findOne({ email: user.email })
        if(!userData) return res.sendStatus(404)
        req.user = userData
        next()
    })
}

module.exports = { authenticateToken }