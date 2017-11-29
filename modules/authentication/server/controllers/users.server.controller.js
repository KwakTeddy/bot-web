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
