const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
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

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground),
)

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm),
)

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground),
)

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground),
)

module.exports = router
