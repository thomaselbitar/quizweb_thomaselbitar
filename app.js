const express = require('express');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const itemRoutes = require('./routes/item.routes');
const fileRoutes = require('./routes/file.routes');

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Express quiz starter is running',
    items: '/api/items',
    files: '/api/files',
  });
});

app.use('/api/items', itemRoutes);
app.use('/api/files', fileRoutes);

app.get('/api/error-demo', (req, res, next) => {
  next(new Error('Demonstrated failure'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
