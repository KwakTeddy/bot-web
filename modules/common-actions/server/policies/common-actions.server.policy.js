'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Custom actions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/common-actions',
      permissions: '*'
    }, {
      resources: '/api/common-actions/:commonActionId',
      permissions: '*'
    }]
  }, {
    roles: ['enterprise', 'user'],
    allows: [{
      resources: '/api/common-actions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/common-actions/:commonActionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/common-actions',
      permissions: ['get']
    }, {
      resources: '/api/common-actions/:commonActionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Custom actions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Custom action is being processed and the current user created it then allow any manipulation
  if (req.commonAction && req.user && req.commonAction.user && req.commonAction.user.id === req.user.id) {
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
