const mongoose   = require('mongoose')
const Schema     = mongoose.Schema

const userSchema = new Schema({
    id_fb : String,
    username : String,
    name  : String,
    email : String,
    picture : String,
    gender : String,
    music : [String]
})

const User = mongoose.model('User', userSchema)

module.exports = User;