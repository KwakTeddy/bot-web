'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Bot auths Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/bot-auths',
      permissions: '*'
    }, {
      resources: '/api/bot-auths/:botAuthId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/bot-auths',
      permissions: ['get', 'post']
    }, {
      resources: '/api/bot-auths/:botAuthId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/bot-auths',
      permissions: ['get']
    }, {
      resources: '/api/bot-auths/:botAuthId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Bot auths Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Bot auth is being processed and the current user created it then allow any manipulation
  if (req.botAuth && req.user && req.botAuth.user && req.botAuth.user.id === req.user.id) {
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
