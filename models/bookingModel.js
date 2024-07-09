const mongoose = require('mongoose');
const Dates = require('./datesModel');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  date: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dates',
    required: [true, 'Booking must have a date'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({ path: 'tour' });
  next();
});

bookingSchema.statics.calcParticipants = async function (dateId) {
  //Make aggregation pipeline to calculate Match date Id and group
  const stats = await this.aggregate([
    {
      $match: {
        date: dateId,
      },
    },
    {
      $lookup: {
        from: 'tours',
        localField: 'tour',
        foreignField: '_id',
        as: 'tourData',
      },
    },
    {
      $group: {
        _id: '$date',
        nParticipants: { $sum: 1 },
        maxGroupSize: { $max: '$tourData.maxGroupSize' },
      },
    },
  ]);

  if (stats[0].nParticipants >= stats[0].maxGroupSize[0]) {
    await Dates.findByIdAndUpdate(dateId, {
      participants: stats[0].nParticipants,
      soldOut: true,
    });
  } else {
    await Dates.findByIdAndUpdate(dateId, {
      participants: stats[0].nParticipants,
      soldOut: false,
    });
  }
};

bookingSchema.post('save', async function () {
  await this.constructor.calcParticipants(this.date);
});

bookingSchema.pre(/^delete/, async function (next) {
  this.r = await this.findOne();
  next();
});
bookingSchema.post(/^delete/, async function () {
  await this.r.constructor.calcParticipants(this.r.date);
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
