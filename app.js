if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const path = require('path')
const campgrounds = require('./routes/campgrounds')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user');
const Campground = require('./models/campground');
const Review = require('./models/review');
//const morgan=require("morgan");

mongoose.connect('mongodb://localhost:27017/camp-square', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('database connected')
})
const app = express()
app.engine('ejs', ejsMate)

//Server file
//setting up views folder
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//home.ejs is the first page
//use morgan package for logging
//app.use(morgan("dev"))
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static(path.join(__dirname, 'public')))
//setting up cookies
 const sessionConfig = {
   secret: 'gotasecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
     httpOnly: true,
     
   },
 }
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
  
   res.locals.currentUser = req.user
   res.locals.success = req.flash('success')
   res.locals.error = req.flash('error')
   next()
 })
app.use('/', users)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
  res.render('home')
})
app.get("/map",async(req,res)=>{
  const campgrounds=await Campground.find({});
  res.render("mapPage",{campgrounds})
  console.log(campgrounds)
  
})
// //USER PROFILE ROUTES
 app.get('/user/:id', async (req, res,) => {
  const user = await User.findById(req.params.id)
  const campgrounds=await Campground.find({});
  const reviews=await Review.find({});
  //console.log(reviews)

  
  res.render('users/profile', { campgrounds,user,reviews });
 });

 app.get('/user/:id/edit', async (req, res) => {
   const user = await User.findById(req.params.id)
   res.render('users/edit', { user });
 })

 app.put('/user/:id', async (req, res) => {
   const { id } = req.params;
   const name=req.body.user.name
   const bio=req.body.user.bio

   const user = await User.findByIdAndUpdate(id, { name: name, bio:bio });
  
  
   
  //  const img = req.files.map((f) => ({
  //   url: f.path,
  // }))
  // console.log(img[0].url)
  // user.avatar=img[0].url
  // await user.save()
   res.redirect(`/user/${user._id}`)
 });

// app.delete('/user/:id', async (req, res) => {
//   const { id } = req.params;
//   await User.findByIdAndDelete(id);
//   res.redirect('/login');
// })
// //USER PROFILE ROUTES

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('server works')
})
