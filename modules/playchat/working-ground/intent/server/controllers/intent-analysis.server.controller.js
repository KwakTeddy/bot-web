var mongoose = require('mongoose');
var async = require('async');

var IntentContent = mongoose.model('IntentContent');
var MatchedIntent = mongoose.model('MatchedIntent');

module.exports.analysis = function(req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
                }
        },
        { $group: { _id: '$intent', count: { $sum: 1 } }},
        { $sort: { created: -1 }}
    ];

    MatchedIntent.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        async.eachSeries(list, function(item, next)
        {
            IntentContent.findOne({ _id: item._id }).populate('intentId').exec(function(err, intentContent)
            {
                if(intentContent)
                {
                    item._id = intentContent;
                }

                next();
            });
        },
        function()
        {
            res.jsonp(list);
        });
    });
};
