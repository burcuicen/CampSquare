const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
  res.render('users/register')
})
router.get('/register', (req, res) => {
  res.render('users/register')
})
router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body
      const user = new User({ email, username })
      const registeredUser = await User.register(user, password)
      console.log(registeredUser)
      req.flash('success', 'Welcome')
      res.redirect('/campgrounds')
    } catch (e) {
      req.flash('error', e.message)
      res.redirect('/register')
    }
  }),
)

module.exports = router
