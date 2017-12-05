'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports.saveLanguage = function(req, res)
{
    User.update({ _id: req.user._id }, {$set: { language: req.body.language }}).exec(function(err, result)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.end();
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
