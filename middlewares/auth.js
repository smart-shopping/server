const jwt = require('jsonwebtoken')

module.exports = {
    check : (req,res,next) => {
        let providedToken   = req.headers.token;;
        if (providedToken) {
            try {
                let decoded     = jwt.verify(providedToken, 'secret')
                if(decoded) {
                    next()
                }

            } catch(err) {
                res.status(401).json({
                    message : 'Wrong token provided, authentication failed !'
                })
            }
        } else {
            res.status(401).json({
                message : 'Please provide a token !'
            })
        }
    }
}
