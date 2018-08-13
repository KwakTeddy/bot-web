'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke UserBots Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/user-bots',
      permissions: '*'
    }, {
      resources: '/api/user-bots/:userBotId',
      permissions: '*'
    }, {
      resources: '/api/user-bots/files/:userBotId',
      permissions: '*'
    }, {
      resources: '/api/user-bots/files/:userBotId/:fileId',
      permissions: '*'
    }]
  }, {
    roles: ['enterprise', 'user'],
    allows: [{
      resources: '/api/user-bots',
      permissions: '*'
    }, {
      resources: '/api/user-bots/:userBotId',
      permissions: '*'
    }, {
      resources: '/api/user-bots/files/:userBotId',
      permissions: '*'
    }, {
      resources: '/api/user-bots/files/:userBotId/:fileId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/user-bots',
      permissions: ['get']
    }, {
      resources: '/api/user-bots/:userBotId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If UserBots Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an userBot is being processed and the current user created it then allow any manipulation
  if (req.userBot && req.user && req.userBot.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
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
