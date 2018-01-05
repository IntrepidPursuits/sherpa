/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import initWebSocketServer from './config/websockets';
import expressConfig from './config/express';
import registerRoutes from './routes';


// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);
const wsInitPromise = initWebSocketServer(server);
expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

wsInitPromise
  .then(primus => {
    app.primus = primus;
  })
  .then(startServer)
  .catch(err => {
    console.log('Server failed to start due to error: %s', err);
  });


// Expose app
exports = module.exports = app;
