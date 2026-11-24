const gameModel = require('../models/game.model');

const FIELDS = ['title', 'studio', 'price', 'stock'];

function bodyOf(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return {};
  }

  return req.body;
}

function hasAllFields(body) {
  return FIELDS.every((field) => body[field] !== undefined);
}

function gameFields(body) {
  return {
    title: body.title,
    studio: body.studio,
    price: body.price,
    stock: body.stock,
  };
}

async function getAll(req, res, next) {
  try {
    const games = await gameModel.getAll(req.filters, req.listOptions);
    res.status(200).json(games);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const game = await gameModel.getById(req.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const body = bodyOf(req);

    if (!hasAllFields(body)) {
      return res.status(400).json({ error: 'title, studio, price and stock are required' });
    }

    const game = await gameModel.create(gameFields(body));
    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
}

async function replace(req, res, next) {
  try {
    const body = bodyOf(req);

    if (!hasAllFields(body)) {
      return res.status(400).json({ error: 'title, studio, price and stock are required' });
    }

    const game = await gameModel.replace(req.id, gameFields(body));

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const body = bodyOf(req);
    const changes = {};

    for (const field of FIELDS) {
      if (body[field] !== undefined) {
        changes[field] = body[field];
      }
    }

    const game = await gameModel.update(req.id, changes);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const removed = await gameModel.remove(req.id);

    if (!removed) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  replace,
  update,
  remove,
};
