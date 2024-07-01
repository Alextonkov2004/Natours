const Dates = require('../models/datesModel');
const factory = require('./handleFactory');

exports.createDate = factory.createOne(Dates);
exports.getAllDates = factory.getAll(Dates);
exports.getDate = factory.getOne(Dates);
exports.deleteDate = factory.deleteOne(Dates);
exports.updateDate = factory.updateOne(Dates);
