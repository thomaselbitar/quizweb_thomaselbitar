const itemModel = require('../models/item.model');

const DB_UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNRESET',
  'EAI_AGAIN',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
  'ER_DBACCESS_DENIED_ERROR',
  'ER_NO_SUCH_TABLE',
  'POOL_CLOSED',
]);

function isDatabaseUnavailable(err) {
  if (!err) {
    return false;
  }
  if (DB_UNAVAILABLE_CODES.has(err.code)) {
    return true;
  }
  return Array.isArray(err.errors) && err.errors.some((item) => DB_UNAVAILABLE_CODES.has(item.code));
}

function handleDbError(err, res, next) {
  if (isDatabaseUnavailable(err)) {
    return res.status(503).json({
      error: 'Database unavailable',
      message:
        'MySQL is not reachable or the items table is not ready. Set DB_PASSWORD in .env if needed, start MySQL, then run npm run db:create and npm run db:setup.',
    });
  }
  return next(err);
}

function parsePrice(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return Number.NaN;
}

function readItemBody(body, { partial }) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: ['body must be a JSON object'], data: {} };
  }

  const errors = [];
  const data = {};
  const hasName = Object.prototype.hasOwnProperty.call(body, 'name');
  const hasDescription = Object.prototype.hasOwnProperty.call(body, 'description');
  const hasPrice = Object.prototype.hasOwnProperty.call(body, 'price');

  if (!partial || hasName) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('name is required and must be a non-empty string');
    } else if (body.name.trim().length > 100) {
      errors.push('name must be at most 100 characters');
    } else {
      data.name = body.name.trim();
    }
  }

  if (hasDescription) {
    if (body.description !== null && typeof body.description !== 'string') {
      errors.push('description must be a string or null');
    } else if (typeof body.description === 'string' && body.description.length > 255) {
      errors.push('description must be at most 255 characters');
    } else {
      data.description = body.description;
    }
  } else if (!partial) {
    data.description = null;
  }

  if (!partial || hasPrice) {
    const price = parsePrice(body.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push('price is required and must be a number greater than or equal to 0');
    } else {
      data.price = price;
    }
  }

  if (partial && !hasName && !hasDescription && !hasPrice) {
    errors.push('provide at least one of: name, description, price');
  }

  return { errors, data };
}

async function getAll(req, res, next) {
  try {
    const items = await itemModel.findAll();
    res.json(items);
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function getOne(req, res, next) {
  try {
    const item = await itemModel.findById(req.validatedId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function create(req, res, next) {
  try {
    const { errors, data } = readItemBody(req.body, { partial: false });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }

    const item = await itemModel.create(data);
    res.status(201).json(item);
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function replace(req, res, next) {
  try {
    const { errors, data } = readItemBody(req.body, { partial: false });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }

    const item = await itemModel.replace(req.validatedId, data);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function update(req, res, next) {
  try {
    const { errors, data } = readItemBody(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }

    const item = await itemModel.update(req.validatedId, data);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await itemModel.remove(req.validatedId);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted', id: req.validatedId });
  } catch (err) {
    handleDbError(err, res, next);
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
