function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const pathOnly = req.originalUrl.split('?')[0];
  console.log(`[${timestamp}] ${req.method} ${pathOnly}`);
  next();
}

module.exports = logger;
