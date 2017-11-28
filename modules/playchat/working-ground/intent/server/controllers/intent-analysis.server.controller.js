var mongoose = require('mongoose');

var Intent = mongoose.model('Intent');
var MatchedIntent = mongoose.model('MatchedIntent');

module.exports.analysis = function(req, res)
{
    var query = [
        { $match: { botId: req.params.botId, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } }},
        { $group: { _id: '$intent', count: { $sum: 1 } }},
        { $sort: { created: -1 }}
    ];

    MatchedIntent.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        Intent.populate(list, { path: '_id' }, function(err, result)
        {
            if(err)
            {
                return res.status(400).send({ message: err.stack || err });
            }

            res.jsonp(result);
        });
    });
};