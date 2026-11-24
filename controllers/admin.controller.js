const adminGameModel = require('../models/adminGame.model');

const FIELDS = ['title', 'studio', 'price', 'stock'];

function bodyOf(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return {};
  }

  return req.body;
}

function requireFields(req, res, next) {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const missing = FIELDS.some((field) => body[field] === undefined);

  if (missing) {
    return res.status(400).json({ error: 'title, studio, price and stock are required' });
  }

  next();
}

async function create(req, res, next) {
  try {
    const body = bodyOf(req);
    const missing = FIELDS.some((field) => body[field] === undefined);

    if (missing) {
      return res.status(400).json({ error: 'title, studio, price and stock are required' });
    }

    const game = await adminGameModel.create({
      title: body.title,
      studio: body.studio,
      price: body.price,
      stock: body.stock,
    });

    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireFields,
  create,
};
