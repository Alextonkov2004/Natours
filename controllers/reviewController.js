const Review = require('../models/reviewModel');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//To check if user participate in tour
exports.checkBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    tour: { _id: req.body.tour },
    user: { _id: req.body.user },
  });

  if (!booking) {
    return next(
      new AppError(
        "You can't review tours that you didn't participate in",
        401,
      ),
    );
  }

  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
