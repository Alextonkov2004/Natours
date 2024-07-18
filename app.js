const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors')

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController')
const datesRouter = require('./routes/datesRoutes');

//Start express app
const app = express();
app.enable('trust proxy')

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



//1) Global middlewares

//Implementing cors
app.use(cors())
//Access-Control-Allow-Origin *

app.options('*', cors())
//app.options('api/v1/tours/:id', cors())

//Serving static files
app.use(express.static(path.join(__dirname, `public`)));

//Set security http requests

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          'http://127.0.0.1:3000',
          'ws://127.0.0.1:1234/',
          'blob:',
          'https://*.mapbox.com',
        ],
        scriptSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://js.stripe.com/v3/',
          'https://*.mapbox.com',
        ],
        frameSrc: ['self', '*.stripe.com', '*.stripe.network'],
        workerSrc: ["'self'", 'data:', 'blob:'],
      },
    },
  }),
);

//Development loging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit request from same API
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour!',
});
app.use('/api', limiter);

app.post('/webhook-checkout', express.raw({type: '*/*'}), bookingController.bookingCheckout)
//Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//Data sanitization agains NoSQL query injection
app.use(mongoSanitize());
//Data sanitization agains XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  }),
);

app.use(compression());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);

  next();
});

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/bookings', bookingRouter);

app.use('/api/v1/dates', datesRouter);
//Error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
