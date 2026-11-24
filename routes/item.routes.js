const express = require('express');
const itemController = require('../controllers/item.controller');
const validateId = require('../middlewares/validateId');

const router = express.Router();

router.get('/', itemController.getAll);
router.get('/:id', validateId, itemController.getOne);
router.post('/', itemController.create);
router.put('/:id', validateId, itemController.replace);
router.patch('/:id', validateId, itemController.update);
router.delete('/:id', validateId, itemController.remove);

module.exports = router;
