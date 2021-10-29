module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must sign in to do that!')
    return res.redirect('/login')
  }
  next()
}
