const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Review = require('../models/reviewModel');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Review) {
      const doc = await Model.findById(req.params.id);
      if (!doc) {
        return next(new AppError('No document found with this ID', 404));
      }
      if (req.user.id !== doc.user.id && doc.user.role !== 'admin') {
        return next(
          new AppError('You cannot delete reviews that are not yours', 401),
        );
      }
    }
      const document = await Model.findByIdAndDelete(req.params.id);
      if (!document) {
        return next(new AppError('No document found with this ID', 404));
      }
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Review) {
      const doc = await Model.findById(req.params.id);
      if (req.user.id !== doc.user.id && doc.user.role !== 'admin') {
        return next(
          new AppError('You cannot edit reviews that are not yours', 401),
        );
      }
    }
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //For nested routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    //const doc = await features.query.explain();
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
