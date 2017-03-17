'use strict';

var   path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var admin = false;
  var path = req.path.split('/');
  if(path.length > 1 && path[1] == 'admin') {
    admin = true;
  }

  if(path[1] == 'mobile') {  // 모바일 화면
    req.session._platform = "mobile";
    res.render('modules/core/server/views/mobile-index2', {
      user: req.user
    });
  } else if(req.query['_p'] == 'nomenu') {
    res.render('modules/core/server/views/nomenu-index', {
      user: req.user
    });
  } else if(path[1] == 'developer') {
    req.session._platform = "web";
    res.render('modules/core/server/views/index', {
      user: req.user || null
    });
  } else {
    res.render('modules/core/server/views/user-bot', {
      user: req.user
    });
  }
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

