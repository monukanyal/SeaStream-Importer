'use strict';

var winston = require('winston');
var settings = require('../settings');

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: 'error',
      filename: settings.root_directory + '/error.log',
      level: 'error'
    })
  ]
});

module.exports = logger;