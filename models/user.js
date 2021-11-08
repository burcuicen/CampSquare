const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  
  },
   avatar: String,
   name: {
     type: String,
     required: true,
    
   },
   isAdmin: {
     type: Boolean,
     default: false,
   },
   bio: {
     type: String,
    
   },

  
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
