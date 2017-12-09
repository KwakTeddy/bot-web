var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');
var BotUser = mongoose.model('BotUser');

module.exports.find = function(req, res)
{
    var query = {};
    query['botId'] = req.params.botId;
    query['liveChat'] = true;
    // query['channel'] = { $ne: "socket" };

    var page = parseInt(req.query.page || 1);
    var countPerPage = parseInt(req.query.countPerPage || 50);
    var sort = { created : 1 };

    if(req.query.sortDir && req.query.sortCol)
    {
        if (req.query.sortDir == 'asc') req.query.sortDir = 1;
        else req.query.sortDir = -1;
        sort[req.query.sortCol] = req.query.sortDir;
    }

    if(req.query.search)
    {
        var searchQuery = {};
        searchQuery['$and'] = [];
        searchQuery.$and.push(query);
        searchQuery.$and.push({
            $or : [
                { channel: { $regex: req.query.search }},
                { userId: { $regex: req.query.search }}
            ]
        });
        query = searchQuery;
    };

    UserDialog.aggregate([ { $match: query }, { $group: { _id: { userKey: "$userId", channel: "$channel", botId: "$botId" }, count: { $sum: 1 }, maxDate: { $max: "$created" } } }, { $sort: sort }, { $skip: (page-1) * countPerPage }, { $limit: countPerPage }]).exec(function (err, data)
    {
        if(err)
        {
            res.status(400).send({ message: err.stack || err });
        }
        else
        {
            UserDialog.aggregate([ { $match: query }, { $group: { _id: { userKey: "$userId", channel: "$channel", botId: "$botId" } } } ]).exec(function (err, data2)
            {
                if(err)
                {
                    res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    var result = { data: data, recordsTotal: data2.length };
                    res.jsonp(result);
                }
            });
        }
    });
};

module.exports.findBotUser = function(req, res)
{
    BotUser.findOne({ botId: req.params.botId, userKey: req.params.userKey }).exec(function(err, result)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.json(result);
    });
};
