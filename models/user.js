const { string, required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  email: {
    type: string,
    required: true,
    unique: true,
  },
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)
