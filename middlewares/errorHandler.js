function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err.status || err.statusCode) || 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;

  if (safeStatus >= 500) {
    console.error(err);
  }

  res.status(safeStatus).json({
    error: safeStatus >= 500 ? 'Internal server error' : 'Request error',
    message: safeStatus >= 500 ? 'Internal server error' : err.message,
  });
}

module.exports = errorHandler;
