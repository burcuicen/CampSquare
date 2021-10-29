const express = require('express')
const router = express.Router({ mergeParams: true })
const { validateReview } = require('../middleware')
const Joi = require('joi')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    //res.send('DONE')
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully created a new review')

    res.redirect(`/campgrounds/${campground._id}`)
  }),
)
router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
  }),
)
module.exports = router
