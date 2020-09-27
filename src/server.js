const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const { contactsRouter } = require('./contacts/contacts.router');
const { authRouter } = require('./auth/auth.router');

module.exports.CRUDServer = {
  app: null,

  initServer() {
    this.app = express();
  },

  async initDbConnection() {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log('Database connection successful');
    } catch (error) {
      console.log('Error: ' + error.message);
      process.exit(1);
    }
  },

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
    this.app.use(morgan('tiny'));
  },

  initRoutes() {
    this.app.use('/auth', authRouter);
    this.app.use('/contacts', contactsRouter);
  },

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;

      return res.status(status).json({ message: err.message });
    });
  },

  startListening(defaultPort) {
    this.app.listen(process.env.PORT || defaultPort, () => {
      console.log('Started listening on port', process.env.PORT || defaultPort);
    });
  },

  async start() {
    this.initServer();
    this.initMiddlewares();
    await this.initDbConnection();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening(3000);
  },
};
