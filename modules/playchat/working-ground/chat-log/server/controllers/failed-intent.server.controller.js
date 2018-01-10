var mongoose = require('mongoose');

var BotIntentFail = mongoose.model('BotIntentFail');
var Intent = mongoose.model('Intent');

module.exports.find = function(req, res)
{
    BotIntentFail.aggregate([{ $match: { botId: req.params.botId, clear: { $ne: true } } }, { $group: { _id: '$intent' } }]).exec(function (err, data)
    {
        if (err)
        {
            res.status(400).send({ message: err.stack || err });
        }
        else
        {
            Intent.populate(data, { path: '_id' },function (err, result)
            {
                if (err)
                {
                    res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    res.jsonp(result);
                }
            });
        }
    });
};
