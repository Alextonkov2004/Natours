const express = require('express');
const dateController = require('../controllers/dateController');

const router = express.Router();

router
  .route('/')
  .get(dateController.getAllDates)
  .post(dateController.createDate);

router
  .route('/:id')
  .get(dateController.getDate)
  .delete(dateController.deleteDate)
  .patch(dateController.updateDate);

module.exports = router;
