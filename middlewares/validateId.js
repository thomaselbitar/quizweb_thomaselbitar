function validateId(req, res, next) {
  const raw = req.params.id;
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0 || String(id) !== raw) {
    return res.status(400).json({
      error: 'Invalid id',
      message: 'id must be a positive integer',
    });
  }

  req.validatedId = id;
  next();
}

module.exports = validateId;
