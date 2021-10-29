const express = require('express')
const router = express.Router()
const Joi = require('joi')

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor } = require('../middleware')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const validateCampground = (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpressError('Invalid Campground Data', 400)
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  })
  const { error } = campgroundSchema.validate(req.body)
  //console.log(result)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

//rendering index file to see if the server working correctly
router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  }),
)
//route for new campground page
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})
//post request to create new campground
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  }),
)
//shows campgrounds by its id on singular page

router.get(
  '/:id',

  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate('reviews')
      .populate('author')
    if (!campground) {
      req.flash('error', 'Cannot find that campground, sorry')
      return res.redirect('/campgrounds')
    }
    //console.log(campground)
    res.render('campgrounds/show', { campground })
  }),
)
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground, sorry')
      return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground })
  }),
)
router.put(
  '/:id',
  validateCampground,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params

    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })
    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campgrounds/${campground._id}`)
  }),
)
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params

    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
  }),
)

module.exports = router
