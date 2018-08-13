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
      resources: ['/api/user-count/:bId/:kind/:arg','/api/dialog-usage/:bId/:kind/:arg', '/api/dialog-success/:bId/:kind/:arg', '/api/session-success/:bId/:kind/:arg', '/api/dialog-failure/:bId/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId', '/api/resetDB', '/api/dialogs/:bId/:fileId', '/api/dialoginfos/:bId/:fileId','/api/saveDialog/:bId/:fileName','/api/loadBot/:bId/:fileName'],
      permissions: '*'
    }]
  }, {
    roles: ['enterprise', 'user'],
    allows: [{
      resources: ['/api/user-count/:bId/:kind/:arg','/api/dialog-usage/:bId/:kind/:arg', '/api/dialog-success/:bId/:kind/:arg', '/api/session-success/:bId/:kind/:arg', '/api/dialog-failure/:bId/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId', '/api/resetDB', '/api/dialogs/:bId/:fileId', '/api/dialoginfos/:bId/:fileId','/api/saveDialog/:bId/:fileName','/api/loadBot/:bId/:fileName'],
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: ['/api/user-count/:bId/:kind/:arg','/api/dialog-usage/:bId/:kind/:arg', '/api/dialog-success/:bId/:kind/:arg', '/api/session-success/:bId/:kind/:arg', '/api/dialog-failure/:bId/:kind/:arg', '/api/dialog/:bId/:dialogId', '/api/dialogchildren/:bId/:dialogId', '/api/resetDB', '/api/dialogs/:bId/:fileId', '/api/dialoginfos/:bId/:fileId','/api/saveDialog/:bId/:fileName','/api/loadBot/:bId/:fileName'],
      permissions: '*'
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
