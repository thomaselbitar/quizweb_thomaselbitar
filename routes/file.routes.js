const express = require('express');
const fileController = require('../controllers/file.controller');

const router = express.Router();

router.get('/', fileController.readItems);
router.post('/append', fileController.appendItem);
router.post('/', fileController.writeItems);

module.exports = router;
