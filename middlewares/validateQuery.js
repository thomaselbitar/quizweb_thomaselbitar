const SORT_FIELDS = ['id', 'title', 'price'];
const ORDERS = ['asc', 'desc'];

function validateQuery(req, res, next) {
  const sortBy = req.query.sortBy === undefined ? 'id' : req.query.sortBy;
  const order = req.query.order === undefined ? 'asc' : req.query.order;

  if (!SORT_FIELDS.includes(sortBy) || !ORDERS.includes(order)) {
    return res.status(400).json({ error: 'Invalid query' });
  }

  const filters = {};

  if (req.query.minPrice !== undefined) {
    const minPrice = Number(req.query.minPrice);
    if (Number.isNaN(minPrice)) {
      return res.status(400).json({ error: 'Invalid query' });
    }
    filters.minPrice = minPrice;
  }

  if (req.query.maxPrice !== undefined) {
    const maxPrice = Number(req.query.maxPrice);
    if (Number.isNaN(maxPrice)) {
      return res.status(400).json({ error: 'Invalid query' });
    }
    filters.maxPrice = maxPrice;
  }

  req.listOptions = { sortBy, order };
  req.filters = filters;
  next();
}

module.exports = validateQuery;
