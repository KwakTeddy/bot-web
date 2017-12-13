'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    crypto = require('crypto'),
    config = require(path.resolve('./config/config'));

var http = require('http');
var smtpTransport = nodemailer.createTransport(config.mailer.options);
var util = require('util');
// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
  '/developer/authentication/signup',
  '/developer/authentication/signup',
];
var request = require('request');


/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.username;

  //check whether already signed up by sns

    //Define email search query
    var emailSearchQuery = {};
    emailSearchQuery['email'] = user.email;
    // console.log(util.inspect(emailSearchQuery));
    // console.log(util.inspect(req.body));

    User.findOne(emailSearchQuery, function (err, result) {
        if (err) {
            return res.status(400).send(err);
        } else {
            if (result && (result.provider == 'local')){
                return res.status(400).send({
                    message: '가입되어 있는 E-mail이네요'
                });
            }
            if (result && (result.provider !== 'local')){
                return res.status(400).send({
                    message: 'SNS 계정(' + result.provider + ')으로 가입했네요'
                });
            }

            async.waterfall([
                // Generate random token
                function (done) {
                    crypto.randomBytes(20, function (err, buffer) {
                        var token = buffer.toString('hex');
                        user.localEmailConfirmToken = token;
                        user.localEmailConfirmExpires = Date.now() + 3600000; // 1 hour
                        if (!result) {
                            // Then save the user
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    // Remove sensitive data before login
                                    user.password = undefined;
                                    user.salt = undefined;
                                    done(err, token, user);
                                }
                            });
                        } else if (result.provider !== user.provider && (!result.additionalProvidersData || !result.additionalProvidersData[user.provider])) {
                            // Add the provider data to the additional provider data field
                            if (!result.additionalProvidersData) {
                                result.additionalProvidersData = {};
                            }

                            result.password = JSON.parse(JSON.stringify(user.password));
                            result['localEmailConfirmToken'] = JSON.parse(JSON.stringify(user.localEmailConfirmToken));
                            result['localEmailConfirmExpires'] = JSON.parse(JSON.stringify(user.localEmailConfirmExpires));

                            user.password = undefined;
                            user.roles = undefined;
                            user.localEmailConfirmToken = undefined;
                            user.localEmailConfirmExpires = undefined;
                            result.additionalProvidersData[user.provider] = user;

                            // Then tell mongoose that we've updated the additionalProvidersData field
                            result.markModified('additionalProvidersData');

                            // And save the result
                            result.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    // Remove sensitive data before login
                                    result.password = undefined;
                                    result.salt = undefined;
                                    done(err, token, user);
                                }
                            });
                        }
                    });
                },
                function (token, user, done) {

                    var httpTransport = 'http://';
                    if (config.secure && config.secure.ssl === true) {
                        httpTransport = 'https://';
                    }
                    res.render(path.resolve('modules/users/server/templates/email-confirm' + (user.language ? '-'+user.language: '-en')), {
                        name: user.displayName,
                        appName: 'Play Chat',
                        url: httpTransport + req.headers.host + '/api/auth/emailconfirm/' + token
                    }, function (err, emailHTML) {
                        done(err, emailHTML, user);
                    });
                },
                // If valid email, send reset email using service
                function (emailHTML, user, done) {
                    var mailOptions = {
                        to: user.email,
                        from: config.mailer.from,
                        subject: '[playchat.ai] e-mail confirm',
                        html: emailHTML
                    };
                    smtpTransport.sendMail(mailOptions, function (err) {
                        console.log(err);
                        if (!err) {
                            return res.status(200).send({
                                message: 'An email has been sent to the provided email with further instructions.'
                            });
                        } else {
                            return res.status(400).send({
                                message: 'Failure sending email'
                            });
                        }

                        done(err);
                    });
                }
            ], function (err) {
                if (err) {
                    return next(err);
                }
            });
        }
    });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {

    if (req.body.resendEmail){
        User.findOne({email: req.body.resendEmail}, function (err, user) {
            if(err){
                console.log(err);
                return err;
            }
            async.waterfall([
                // Generate random token
                function (done) {
                    crypto.randomBytes(20, function (err, buffer) {
                        var token = buffer.toString('hex');
                        user.localEmailConfirmToken = token;
                        user.localEmailConfirmExpires = Date.now() + 3600000; // 1 hour
                            // Then save the user
                            user.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    // Remove sensitive data before login
                                    user.password = undefined;
                                    user.salt = undefined;
                                    done(err, token, user);
                                }
                            });
                    });
                },
                function (token, user, done) {

                    var httpTransport = 'http://';
                    if (config.secure && config.secure.ssl === true) {
                        httpTransport = 'https://';
                    }
                    res.render(path.resolve('modules/users/server/templates/email-confirm' + (user.language ? '-'+user.language: '-en')), {
                        name: user.displayName,
                        appName: 'Play Chat',
                        url: httpTransport + req.headers.host + '/api/auth/emailconfirm/' + token
                    }, function (err, emailHTML) {
                        done(err, emailHTML, user);
                    });
                },
                // If valid email, send reset email using service
                function (emailHTML, user, done) {
                    var mailOptions = {
                        to: user.email,
                        from: config.mailer.from,
                        subject: '[playchat.ai] e-mail confirm',
                        html: emailHTML
                    };
                    smtpTransport.sendMail(mailOptions, function (err) {
                        if (!err) {
                            return res.send({
                                message: 'An email has been sent to the provided email with further instructions.'
                            });
                        } else {
                            return res.status(400).send({
                                message: 'Failure sending email'
                            });
                        }
                    });
                }
            ]);
        })
    } else {
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                res.status(400).send(info);
            } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.cookie('login', true);
                      res.json(user);
                    }
                });
            }
        })(req, res, next);
    }
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  req.session.destroy();
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if(req.query['path']) res.redirect(req.query['path']);
  else if (req.query['redirect_to']) res.redirect((req.query['redirect_to']));
  else res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
// Do not redirect to a signin or signup page
if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
    req.session.redirect_to = req.query.redirect_to;
}
// Authenticate
passport.authenticate(strategy, scope)(req, res, next);
};
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy, scope) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;
    // console.log('callback');

    passport.authenticate(strategy, scope, function (err, user, redirectURL) {
      if (err) {
        console.log(err);
        if (sessionRedirectURL && sessionRedirectURL.indexOf('developer') > -1) {
          return res.redirect('/developer/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
        }else {
          return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
        }
      }
      if (!user) {
        if (sessionRedirectURL && sessionRedirectURL.indexOf('developer') > -1) {
          return res.redirect('/developer/authentication/signin');
        }else {
          return res.redirect('/authentication/signin');
        }
      }
      req.login(user, function (err) {
        if (err) {
          if (sessionRedirectURL && sessionRedirectURL.indexOf('developer') > -1) return res.redirect('/developer/authentication/signin');
          else                                                                    return res.redirect('/authentication/signin');
        }
        res.cookie('login', true);
        if (sessionRedirectURL && sessionRedirectURL.indexOf('developer') > -1) return res.redirect('/developer');
        else                                                                    return res.redirect('/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    //Define email search query
    if(providerUserProfile.email){
      var emailSearchQuery = {};
      emailSearchQuery['email'] = providerUserProfile.email;
      searchQuery.$or.push(emailSearchQuery);
    }

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
          user = new User({
            // firstName: providerUserProfile.firstName,
            // lastName: providerUserProfile.lastName,
            username: possibleUsername,
            displayName: providerUserProfile.displayName,
            email: providerUserProfile.email,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });
          user.save(function (err) {
            return done(err, user);
          });
        } else {
          // if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
          if (user.provider != providerUserProfile.provider) {
              if (!user.additionalProvidersData) user.additionalProvidersData = {};
              user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
              user.markModified('additionalProvidersData');
              user.save(function (err) {
                console.log(err);
                return done(err, user);
                // return done(err, user, '/settings/accounts');
              });
          } else {
            user.providerData = providerUserProfile.providerData;
            user.markModified('providerData');
            user.save(function (err) {
              if (err) console.log(err);
              return done(err, user);
            })
          }
        }
      }
    });
  } else {
    var user = req.user;
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) user.additionalProvidersData = {};
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
      user.markModified('additionalProvidersData');
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      user.providerData = providerUserProfile.providerData;
      user.markModified('providerData');
      user.save(function (err) {
        if (err) console.log(err);
        return done(new Error('User is already connected using this provider'), user);
      })
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          res.cookie('login', true);
          return res.json(user);
        }
      });
    }
  });
};

/**
 * Email Confirm GET from email token
 */
exports.validateEmailConfirmToken = function (req, res) {

    //Define email search query
    var emailConfirmQuery = {};
    emailConfirmQuery['localEmailConfirmToken'] = req.params.token;
    emailConfirmQuery['localEmailConfirmExpires'] = {
        $gt: Date.now()
    };

    User.findOne(emailConfirmQuery, function (err, user) {
        if (!user) {
            return res.redirect('/emailconfirm/invalid');
        }
        user.localEmailConfirmed = true;
        user.localEmailConfirmToken = undefined;
        user.localEmailConfirmExpires = undefined;

        user.save(function (err) {
            if (err){
                console.log(err);
            }else {
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                      res.cookie('login', true);
                      res.redirect('/developer');
                    }
                });
            }
        });
    });
};


/**
 * Get Token FB
 */
exports.getToken = function (req, res) {
 User.findOne({_id: req.params.userId}, function (err, data) {
   return res.json(data);
 })

};
