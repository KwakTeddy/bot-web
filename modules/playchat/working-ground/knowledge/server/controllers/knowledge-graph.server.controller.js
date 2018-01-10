'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Fact = mongoose.model('Fact'),
    FactLink = mongoose.model('FactLink'),
    FactAtom = mongoose.model('FactAtom'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
    var fact = new Fact(req.body);
    fact.user = req.user;

    fact.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(fact);
        }
    });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var fact = req.fact ? req.fact.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    fact.isCurrentUserOwner = req.user && fact.user && fact.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(fact);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
    var fact = req.fact ;

    fact = _.extend(fact , req.body);

    fact.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(fact);
        }
    });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
    var fact = req.fact ;

    fact.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(fact);
        }
    });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
    Fact.find().sort('-created').populate('user', 'displayName').exec(function(err, facts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(facts);
        }
    });
};

/**
 * Custom action middleware
 */
exports.factByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Custom action is invalid'
        });
    }

    Fact.findById(id).populate('user', 'displayName').exec(function (err, fact) {
        if (err) {
            return next(err);
        } else if (!fact) {
            return res.status(404).send({
                message: 'No Custom action with that identifier has been found'
            });
        }
        req.fact = fact;
        next();
    });
};

exports.create = function(req, res) {
    var factLink = new FactLink(req.body);
    factLink.user = req.user;

    factLink.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factLink);
        }
    });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var factLink = req.factLink ? req.factLink.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    factLink.isCurrentUserOwner = req.user && factLink.user && factLink.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(factLink);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
    var factLink = req.factLink ;

    factLink = _.extend(factLink , req.body);

    factLink.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factLink);
        }
    });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
    var factLink = req.factLink ;

    factLink.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factLink);
        }
    });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
    FactLink.find().sort('-created').populate('user', 'displayName').exec(function(err, factLinks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factLinks);
        }
    });
};

exports.findByBotId = function(req, res) {
    var query = {bot_id:req.params.bot_id};
    FactLink.find(query).limit(500).sort('-created').exec(function(err, factLinks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factLinks);
        }
    });
};

exports.find = function(req, res) {
    FactLink.remove({botUser: req.params.factBotUserId}, function(err) {
        FactLink.find({bot_id: req.params.factBotUserId}).limit(500).sort('-created').exec(function(err, factLinks) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(factLinks);
            }
        });
    });
};

/**
 * Custom action middleware
 */
exports.factLinkByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Custom action is invalid'
        });
    }

    FactLink.findById(id).populate('user', 'displayName').exec(function (err, factLink) {
        if (err) {
            return next(err);
        } else if (!factLink) {
            return res.status(404).send({
                message: 'No Custom action with that identifier has been found'
            });
        }
        req.factLink = factLink;
        next();
    });
};

exports.create = function(req, res) {
    var factAtom = new FactAtom(req.body);
    factAtom.user = req.user;

    factAtom.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factAtom);
        }
    });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var factAtom = req.factAtom ? req.factAtom.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    factAtom.isCurrentUserOwner = req.user && factAtom.user && factAtom.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(factAtom);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
    var factAtom = req.factAtom ;

    factAtom = _.extend(factAtom , req.body);

    factAtom.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factAtom);
        }
    });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
    var factAtom = req.factAtom ;

    factAtom.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factAtom);
        }
    });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
    FactAtom.find().sort('-created').populate('user', 'displayName').exec(function(err, factAtoms) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(factAtoms);
        }
    });
};

/**
 * Custom action middleware
 */
exports.factAtomByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Custom action is invalid'
        });
    }

    FactAtom.findById(id).populate('user', 'displayName').exec(function (err, factAtom) {
        if (err) {
            return next(err);
        } else if (!factAtom) {
            return res.status(404).send({
                message: 'No Custom action with that identifier has been found'
            });
        }
        req.factAtom = factAtom;
        next();
    });
};
