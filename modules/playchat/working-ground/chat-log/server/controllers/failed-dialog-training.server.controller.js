var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');

module.exports.find = function(req, res)
{
    UserDialog.find({ botId: req.params.botId, fail: true }).sort('-created').lean().exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.jsonp(list);
    });
};
