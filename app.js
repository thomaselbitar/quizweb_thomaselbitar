const express = require('express');
const session = require('express-session');

const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const gamesRoutes = require('./routes/games.routes');
const adminRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(logger);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => {
  res.status(200).send('Welcome To Our Game Store');
});

app.use('/games', gamesRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
