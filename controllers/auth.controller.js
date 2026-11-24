const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

async function login(req, res, next) {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const email = body.email;
    const password = body.password;

    if (email === undefined || password === undefined) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    const matches = user
      ? await bcrypt.compare(String(password), user.password_hash)
      : false;

    if (!user || !matches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
};
