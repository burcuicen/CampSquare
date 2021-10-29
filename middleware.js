module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //store to users link to redirect after sign in
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must sign in to do that!')
    return res.redirect('/login')
  }
  next()
}
