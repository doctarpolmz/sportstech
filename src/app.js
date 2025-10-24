const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

function createApp() {
  const app = express();

  app.use(morgan('dev'));
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const publicDir = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDir));

  const ussdRouter = require('./routes/ussd');
  const apiRouter = require('./routes/api');

  app.use('/ussd', ussdRouter);
  app.use('/api', apiRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ARIP', timestamp: new Date().toISOString() });
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
