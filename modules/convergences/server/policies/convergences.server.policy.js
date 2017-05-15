'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Convergences Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/convergences',
      permissions: '*'
    }, {
      resources: '/api/convergences/:convergenceId',
      permissions: '*'
    }]
  }, {
    roles: ['enterprise', 'user'],
    allows: [{
      resources: '/api/convergences',
      permissions: ['get', 'post']
    }, {
      resources: '/api/convergences/:convergenceId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/convergences',
      permissions: ['get']
    }, {
      resources: '/api/convergences/:convergenceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Convergences Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Convergence is being processed and the current user created it then allow any manipulation
  if (req.convergence && req.user && req.convergence.user && req.convergence.user.id === req.user.id) {
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
