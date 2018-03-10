const User = require('../models/User')
const FB   = require('fb')
const jwt  = require('jsonwebtoken')

module.exports = {
    signIn : (req,res) => {
        FB.setAccessToken(req.body.data);
        FB.api('me', {fields: ['id' , 'name', 'email', 'gender', 'picture'], access_token: req.body.data}, function(userData) {
                User.findOne({
                email : userData.email
            })
            .exec()
            .then((user) => {
                if (user) {
                    let token = jwt.sign({userId : user._id, idFb : user.fb_id, email : user.email}, 'secret')
                    res.status(200).json({
                        message : `Login success`,
                        data : {
                            user_id : user._id,
                            id_fb   : user.id_fb,
                            email   : user.email,
                            token   : token
                        },
                    })
                } else {
                    User.create({
                        id_fb : userData.id,
                        email : userData.email,
                        picture : userData.picture.data.url,
                        gender : userData.gender
                    }, (err,newUser) => {
                        if (err) {
                            res.status(500).json({
                                message : `Failed to create new account`,
                                data    : {}
                            })
                        }

                        let token = jwt.sign({userId : newUser._id, fbId : newUser.id_fb, email : newUser.emai},'secret')

                        res.status(200).json({
                            message : `New account created, login success !`,
                            data    : {
                                user_id : newUser._id,
                                id_fb   : newUser.id_fb,
                                email   : newUser.email,
                                token   : token
                            }
                        })
                    })
                }
            })
        })
    },

    testJwt : (req,res) => {
        res.status(200).json({
            message : `Selamat, token anda berhasil !`
        })
    }
}
