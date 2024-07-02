const Dates = require('../models/datesModel');
const factory = require('./handleFactory');
const AppError = require('../utils/appError')

exports.checkDate = (req, res, next) => {
const date = new Date(req.body.date).getTime()
    if(date < Date.now()){
return(next(new AppError('You cannot create past dates', 400)))
    }
    next()
}
exports.createDate = factory.createOne(Dates);
exports.getAllDates = factory.getAll(Dates);
exports.getDate = factory.getOne(Dates);
exports.deleteDate = factory.deleteOne(Dates);
exports.updateDate = factory.updateOne(Dates);
