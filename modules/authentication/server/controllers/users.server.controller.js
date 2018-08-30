'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var path = require('path');

var nodemailer = require('nodemailer');
var config = require(path.resolve('./config/config'));
var smtpTransport = nodemailer.createTransport(config.mailer.options);

var crypto = require('crypto');

module.exports.updateUser = function(req, res)
{
    User.findOne({ _id: req.user._id }).exec(function(err, user)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var query = { language: req.body.language };
        if(req.body.password)
        {
            query.password = crypto.pbkdf2Sync(req.body.password, new Buffer(user.salt, 'base64'), 10000, 64).toString('base64');
        }

        User.update({ _id: req.user._id }, { $set: query }).exec(function(err, result)
        {
            res.end();
        });
    });
};

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

        console.log('====search query====');
        console.log(searchQuery);
        console.log('====search query end====');

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

exports.validateResetToken = function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user)
        {
            return res.redirect('/password/reset/invalid');
        }

        res.redirect('/password/reset/' + req.params.token);
    });
};

exports.reset = function (req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    var message = null;


    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec(function(err, user)
    {
        if(!err && user)
        {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword)
            {
                user.password = passwordDetails.newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err)
                {
                    if (err)
                    {
                        return res.status(400).send({ error: err });
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
                                // Remove sensitive data before return authenticated user
                                user.password = undefined;
                                user.salt = undefined;
                                res.cookie('login', true);
                                res.json(user);

                                res.render('modules/users/server/templates/reset-password-confirm-email' + (user.language ? '-'+user.language: '-en'),
                                {
                                    name: user.displayName,
                                    appName: config.app.title
                                },
                                function (err, emailHTML)
                                {
                                    var mailOptions = {
                                        to: user.email,
                                        from: config.mailer.from,
                                        subject: '[playchat.ai] Password has been changed.',
                                        html: emailHTML
                                    };

                                    smtpTransport.sendMail(mailOptions, function (err)
                                    {
                                        res.status(200).end();
                                    });
                                });
                            }
                        });
                    }
                });
            }
            else
            {
                return res.status(400).send({ message: 'Password is disaccord' });
            }
        }
        else
        {
            return res.status(400).send({ message: 'expired' });
        }
    });
};


//update bizplaychat user
exports.saveBizAuthUserProfile = function (req, res, next) {
    User.findOne({"email": req.body.email}, function (err, user) {
        user.bizKindOfBusiness = '';
        user.phone =  '';
        user.organization =  '';
        user.bizChairEmail = '';
        user.bizChairName = '';

        user.bizKindOfBusiness = req.body.bizKindOfBusiness;
        user.phone = req.body.phone;
        user.organization = req.body.organization;
        user.bizChairEmail = req.body.bizChairEmail;
        user.bizChairName = req.body.bizChairName;

        user.save(function (err) {
            if (err) {
                console.log(err);
                return  res.status(400).send({ message: 'fail' || err });
            }
            else{
                console.log('success');
                return res.jsonp({ message: 'success' });
            }
        })
    })
};
