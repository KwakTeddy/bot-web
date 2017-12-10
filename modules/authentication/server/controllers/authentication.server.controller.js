var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require(path.resolve('./config/config'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);

var User = mongoose.model('User');

module.exports.signin = function(req, res, next)
{
    passport.authenticate('local', function (err, user, info)
    {
        if (err || !user)
        {
            res.status(400).send(info);
        }
        else
        {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            if(user.state === false)
            {
                res.status(401).send('not registration');
                return;
            }

            req.login(user, function (err)
            {
                if (err)
                {
                    res.status(400).send(err);
                }
                else
                {
                    res.cookie('login', true);
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

module.exports.signout = function (req, res)
{
    req.logout();
    req.session.destroy();
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if(req.query['path'])
    {
        res.redirect(req.query['path']);
    }
    else if(req.query['redirect_to'])
    {
        res.redirect((req.query['redirect_to']));
    }
    else
    {
        res.redirect('/');
    }
};

var makeUsername = function(index, callback, errorCallback)
{
    User.findOne({ username: 'user' + index }).exec(function(err, item)
    {
        if(err)
        {
            errorCallback(err);
        }
        else
        {
            if(item)
            {
                makeUsername(index+1, callback, errorCallback);
            }
            else
            {
                callback('user' + index);
            }
        }
    });
};

module.exports.signup = function(req, res, next)
{
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);
    var message = null;

    // Add missing user fields
    user.provider = 'local';
    user.state = false; // for closed beta
    // user.displayName = user.username;

    makeUsername(0, function(username)
    {
        //check whether already signed up by sns

        user.username = username;

        //Define email search query
        var emailSearchQuery = {};
        emailSearchQuery['email'] = user.email;

        User.findOne(emailSearchQuery, function (err, result)
        {
            if (err)
            {
                return res.status(400).send(err);
            }
            else
            {
                if (result && (result.provider == 'local'))
                {
                    return res.status(400).send({ message: 'Email is already signed up.' });
                }

                if (result && (result.provider !== 'local'))
                {
                    return res.status(400).send({ message: 'SNS', provider : result.provider });
                }

                async.waterfall([
                    // Generate random token
                    function (done)
                    {
                        crypto.randomBytes(20, function (err, buffer)
                        {
                            var token = buffer.toString('hex');
                            user.localEmailConfirmToken = token;
                            user.localEmailConfirmExpires = Date.now() + 3600000; // 1 hour
                            if (!result)
                            {
                                // Then save the user
                                user.save(function (err)
                                {
                                    if (err)
                                    {
                                        console.log(err);
                                        return res.status(400).send({ message: err.stack || err });
                                    }
                                    else
                                    {
                                        // Remove sensitive data before login
                                        user.password = undefined;
                                        user.salt = undefined;
                                        done(err, token, user);
                                    }
                                });
                            }
                            else if (result.provider !== user.provider && (!result.additionalProvidersData || !result.additionalProvidersData[user.provider]))
                            {
                                // Add the provider data to the additional provider data field
                                if (!result.additionalProvidersData)
                                {
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
                                result.save(function (err)
                                {
                                    if (err)
                                    {
                                        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                                    }
                                    else
                                    {
                                        // Remove sensitive data before login
                                        result.password = undefined;
                                        result.salt = undefined;
                                        done(err, token, user);
                                    }
                                });
                            }
                        });
                    },
                    function (token, user, done)
                    {
                        var httpTransport = 'http://';
                        if (config.secure && config.secure.ssl === true)
                        {
                            httpTransport = 'https://';
                        }

                        res.render(path.resolve('modules/authentication/server/templates/email-confirm'),
                            {
                                name: user.displayName,
                                appName: 'Play Chat',
                                url: httpTransport + req.headers.host + '/api/auth/emailconfirm/' + token
                            }, function (err, emailHTML)
                            {
                                done(err, emailHTML, user);
                            });
                    },
                    // If valid email, send reset email using service
                    function (emailHTML, user, done)
                    {
                        var mailOptions = {
                            to: user.email,
                            from: config.mailer.from,
                            subject: 'E-mail 인증',
                            html: emailHTML
                        };

                        smtpTransport.sendMail(mailOptions, function (err)
                        {
                            if (!err)
                            {
                                return res.status(200).send({ message: 'An email has been sent to the provided email with further instructions.' });
                            }
                            else
                            {
                                return res.status(400).send({ message: 'Failure sending email' });
                            }

                            done(err);
                        });
                    }
                ], function (err)
                {
                    if (err)
                    {
                        return next(err);
                    }
                });
            }
        });
    }, function(err)
    {
        console.error(err);
        return res.status(400).send(err);
    });
};

module.exports.validateEmailConfirmToken = function(req, res)
{
    //Define email search query
    var emailConfirmQuery = {};
    emailConfirmQuery['localEmailConfirmToken'] = req.params.token;
    emailConfirmQuery['localEmailConfirmExpires'] = {
        $gt: Date.now()
    };

    User.findOne(emailConfirmQuery, function (err, user)
    {
        if (!user)
        {
            return res.redirect('/emailconfirm/invalid');
        }

        user.localEmailConfirmed = true;
        user.localEmailConfirmToken = undefined;
        user.localEmailConfirmExpires = undefined;

        user.save(function (err)
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                req.login(user, function (err)
                {
                    if (err)
                    {
                        res.status(400).send(err);
                    }
                    else
                    {
                        //for closedbeta
                        // res.cookie('login', true);
                        res.redirect('/');
                    }
                });
            }
        });
    });
};

module.exports.forgot = function (req, res, next)
{
    async.waterfall([
        // Generate random token
        function (done)
        {
            crypto.randomBytes(20, function (err, buffer)
            {
                var token = buffer.toString('hex');
                done(err, token);
            });
        },
        // Lookup user by email
        function (token, done)
        {
            if (req.body.email)
            {
                User.findOne({ email: req.body.email.toLowerCase() }, '-salt -password', function (err, user)
                {
                    if (!user)
                    {
                        return res.status(404).end();
                    }
                    else if ((user.provider !== 'local') && (!user.additionalProvidersData || !user.additionalProvidersData.local))
                    {
                        return res.status(400).send({ message: 'SNS', provider: user.provider });
                    }
                    else
                    {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function (err)
                        {
                            done(err, token, user);
                        });
                    }
                });
            }
            else
            {
                return res.status(404).end();
            }
        },
        function (token, user, done)
        {

            var httpTransport = 'http://';
            if (config.secure && config.secure.ssl === true)
            {
                httpTransport = 'https://';
            }

            res.render(path.resolve('modules/authentication/server/templates/reset-password-email'),
            {
                name: user.displayName,
                appName: config.app.title,
                url: httpTransport + req.headers.host + '/api/auth/reset/' + token + '/password'
            },
            function (err, emailHTML)
            {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done)
        {
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: '비밀번호 재설정',
                html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function (err)
            {
                if (!err)
                {
                    res.end();
                }
                else
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                done(err);
            });
        }
    ], function (err)
    {
        if (err) {
            return next(err);
        }
    });
};


exports.oauthCall = function (strategy, scope) {
    return function (req, res, next) {

        var redirectTo = req.query.redirect_to;
        req.session.redirect_to = redirectTo;

        passport.authenticate(strategy, scope)(req, res, next);
    };
};

exports.oauthCallback = function (strategy, scope) {
    return function (req, res, next) {
        // Pop redirect URL from session
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;
        // console.log('callback');

        passport.authenticate(strategy, scope, function (err, user, redirectURL)
        {
            if (err)
            {
                if(err.message == 'User is already connected using this provider')
                {
                    if(sessionRedirectURL)
                    {
                        return res.redirect(sessionRedirectURL);
                    }
                }
                else
                {
                    console.error(err);
                    return res.redirect('/signin?err=' + encodeURIComponent(err));
                }
            }

            if (!user)
            {
                return res.redirect('/signin?err=' + encodeURIComponent('User is not found'));
            }

            req.login(user, function (err)
            {
                if (err) {
                    if (sessionRedirectURL)
                    {
                        return res.redirect(sessionRedirectURL);
                    }
                    else
                    {
                        return res.redirect('/signin');
                    }
                }
                res.cookie('login', true);
                if (sessionRedirectURL)
                {
                    return res.redirect(sessionRedirectURL);
                }
                else
                {
                    return res.redirect('/');
                }
            });
        })(req, res, next);
    };
};
