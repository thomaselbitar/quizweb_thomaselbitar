const express = require('express');
const validateRole = require('../middlewares/validateRole');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.post(
  '/games',
  validateRole('admin'),
  adminController.requireFields,
  adminController.create
);

module.exports = router;
