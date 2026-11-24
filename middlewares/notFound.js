function notFound(req, res) {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
