const express = require('express');
const validateId = require('../middlewares/validateId');
const validateQuery = require('../middlewares/validateQuery');
const gamesController = require('../controllers/games.controller');

const router = express.Router();

router.get('/', validateQuery, gamesController.getAll);
router.get('/:id', validateId, gamesController.getOne);
router.post('/', gamesController.create);
router.put('/:id', validateId, gamesController.replace);
router.patch('/:id', validateId, gamesController.update);
router.delete('/:id', validateId, gamesController.remove);

module.exports = router;
