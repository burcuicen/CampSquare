const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const users = require('../controllers/users')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
//refactor similar routes to write clean code
router
  .route('/register')
  .get(users.renderRegister)
  .post( upload.array('avatar'),catchAsync(users.register))

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.login,
  )

router.get('/logout', users.logout)

module.exports = router
