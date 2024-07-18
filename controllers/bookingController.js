const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Dates = require('../models/datesModel');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour

  const tour = await Tour.findById(req.params.tourId);
  const options = tour.startDates.map((el) => ({
    label:
      el.soldOut === false
        ? el.date.toLocaleString('en-us', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : `${el.date.toLocaleString('en-us', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })} (SOLD OUT)`,
    value: el._id.toLocaleString(),
  }));

  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    //success_url: `${req.protocol}://${req.gesuccess_url: `${req.protocol}://${req.get('host')}/t('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&date=${tour.startDates[0]._id}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    custom_fields: [
      {
        key: 'alex_the_best',
        label: {
          custom: 'Select date for the tour:',
          type: 'custom',
        },
        type: 'dropdown',
        dropdown: {
          options /*[
            {
              label: tour.startDates[0].date.toLocaleString('en-us', {day: 'numeric', month: 'long', year: 'numeric'}),
              value: 'ooo',
            },
          ],
          */,
        },
      },
    ],

    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
        },
      },
    ],
  });

  //3) Create session as a response
  res.status(200).json({
    status: 'success',
    session,
  });
});

//for development
exports.checksoldOut = catchAsync(async (req, res, next) => {
  if (req.body.date) {
    const tourDate = await Dates.findById(req.body.date);
    if (tourDate.soldOut === true) {
      return next(
        new AppError(
          'You cannot book the tour for this date because it is already sold out.',
          400,
        ),
      );
    }
  }
  next();
});

exports.bookingCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email }))._id;
    const price = session.amount_total / 100;
    const date = session.custom_fields[0].dropdown.value;
    const tourDate = await Dates.findById(date);
    if (tourDate.soldOut === true) {
      return next(
        new AppError(
          'You cannot book the tour for this date because it is already sold out.',
          400,
        ),
      );
    }
    await Booking.create({ tour, user, price, date });
    res.status(200).json({ received: true });
  }
};

/*
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total/100
const date = session.custom_fields[0].dropdown.value
console.log(tour, user, price, date)
  await Booking.create({tour, user, price, date})
};

exports.bookingCheckout = (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  
    res.status(200).json({ received: true });
  }
  }
  */
exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.getBooking = factory.getOne(Booking);
