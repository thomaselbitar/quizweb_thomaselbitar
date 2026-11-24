const userModel = require('../models/user.model');

function validateRole(role) {
  return async function roleMiddleware(req, res, next) {
    try {
      const userId = req.session && req.session.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Not logged in' });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(401).json({ error: 'Not logged in' });
      }

      if (user.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validateRole;
