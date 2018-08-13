var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    UserDialog.aggregate(
        [
            {$match:
                {
                    botId : req.params.botId,
                    dialog: { $nin: [null,":reset user", ":build " + req.params.botId + " reset", ':build'] },
                    inOut : true,
                    isFail : true,
                    created : { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
                    "channel.name" : { $ne: 'channel' }
                }
            },
            {$group: {_id: {dialog:'$dialog'}, id: {$first: '$_id'}, count: {$sum: 1}}},
            {$sort: {count: -1}},
            {$limit: 300}
        ]
    ).exec(function (err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(list);
        }
    });
};
