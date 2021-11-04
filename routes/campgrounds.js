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
//refactor similar routes to write clean code
router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground),
  )

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground),
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm),
)

module.exports = router
