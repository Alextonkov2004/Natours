const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date must have value.'],
  },
  participants: {
    type: Number,
    default: 0,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Date must belong to a tour'],
  },
});

const Dates = mongoose.model('Dates', dateSchema);

module.exports = Dates;
