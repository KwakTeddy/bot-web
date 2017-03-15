'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Analytics Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: ['/api/user-count/:kind/:arg','/api/dialog-usage/:kind/:arg', '/api/dialog-success/:kind/:arg', '/api/session-success/:kind/:arg', '/api/dialog-failure/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId'],
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: ['/api/user-count/:kind/:arg','/api/dialog-usage/:kind/:arg', '/api/dialog-success/:kind/:arg', '/api/session-success/:kind/:arg', '/api/dialog-failure/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId'],
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: ['/api/user-count/:kind/:arg','/api/dialog-usage/:kind/:arg', '/api/dialog-success/:kind/:arg', '/api/session-success/:kind/:arg', '/api/dialog-failure/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId'],
      permissions: []
    }]
  }]);
};

/**
 * Check If Bot users Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Bot user is being processed and the current user created it then allow any manipulation
  if (req.botUser && req.user && req.botUser.user && req.botUser.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
