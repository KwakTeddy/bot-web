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

var smtpTransport = nodemailer.createTransport(config.mailer.options);
var util = require('util');
// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
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
    console.log(util.inspect(emailSearchQuery));
    console.log(util.inspect(req.body));

    User.findOne(emailSearchQuery, function (err, result) {
        if (err) {
            return err;
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
                    res.render(path.resolve('modules/users/server/templates/email-confirm'), {
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
                        subject: 'E-mail 인증',
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
  // var soap = require('soap');
  // var url = 'http://api.auction.co.kr/APIv1/AuctionService.asmx?WSDL';
  // var args = {};
  // args = {
  //   req: {
  //     attributes: {
  //       ItemID: 'B017297198'
  //     }
  //   }
  // };
  // var soapHeader = {
  //   "EncryptedTicket": {
  //     attributes: {xmlns: 'http://www.auction.co.kr/Security'},
  //     Value: 'd4bf9KGW48nXIFoUtdInx7Z6ajRe4KokvjiEN+2NAPBaP18XuCEBsWcU8w78/B6oQzUYoQheiv+hL6FpKnOw3g1f/r4zF9aU8GhxvVNwjlXaBxsZ74EXB78gF4yxmdqmCwNphS7rhVxUCvJA+pN5VG5kZgE6saq8n9pqjE9E1G/AewHe9hZr//6lLeFcfK+DSTLVEx0uTlHvoLHoSXPWOcw='}
  // };
  //
  // soap.createClient(url, function(err, client) {
  //   client.addSoapHeader(soapHeader);
  //   client.AuctionService.AuctionServiceSoap.ViewItem(args, function(err, result) {
  //     console.log(util.inspect(result));
  //   });
  // });

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
                    res.render(path.resolve('modules/users/server/templates/email-confirm'), {
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
                        subject: 'E-mail 인증',
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

  if(req.query['path']) res.redirect(req.query['path']);
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
    console.log(util.inspect(scope));
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
    console.log('callback');

    passport.authenticate(strategy, scope, function (err, user, redirectURL) {
        console.log(err);
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }
        console.log(redirectURL.redirect_to);
        console.log(sessionRedirectURL);
        return res.redirect(redirectURL.redirect_to || sessionRedirectURL || '/');
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

    //Define email search query
    var emailSearchQuery = {};
    emailSearchQuery['email'] = providerUserProfile.email;

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
        $or: [mainProviderSearchQuery, additionalProviderSearchQuery, emailSearchQuery]
    };

      User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
          if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
              // Add the provider data to the additional provider data field
              if (!user.additionalProvidersData) {
                  user.additionalProvidersData = {};
              }

              user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

              // Then tell mongoose that we've updated the additionalProvidersData field
              user.markModified('additionalProvidersData');

              // And save the user
              user.save(function (err) {
                console.log(err);
                  return done(err, user, '/settings/accounts');
              });
          } else {
              return done(err, user);
          }
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      console.log(util.inspect(providerUserProfile.providerData.accessToken));
      User.findOne({_id: user.id}, function (err, data) {
        if (data.provider == 'facebook'){
          data.providerData.accessToken = providerUserProfile.providerData.accessToken;
        }else {
          data.additionalProvidersData.facebook.accessToken = providerUserProfile.providerData.accessToken;
        }
        data.save(function (err) {
          if (err) console.log(err);
          return done(new Error('User is already connected using this provider'), user);
        })
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
                        res.redirect('/');
                    }
                });
            }
        });
    });
};
