var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var match = {};
    match.botId = req.params.botId;
    match.created = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
    match.inOut = true;
    match.dialog = { $ne: null, $nin: [":reset user", ":build " + req.params.botId + " reset", ':build'] };
    match.fail = true;
    match.channel = { $ne: 'channel' };

    UserDialog.aggregate(
        [
            {$match: match},
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
