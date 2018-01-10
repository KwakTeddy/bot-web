var path = require('path');

var botLib = require(path.resolve('./engine/bot.js'));

var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var botId = req.params.botId;

    var query = [
        { $match: { botId: botId, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }, inOut: true, dialogId: {$ne: null}, dialogName: {$ne: null}, dialog: {$nin: [':build', ':reset uesr']}} },
        { $group: { _id: { dialogName: '$dialogName', dialog: '$dialog'}, count: { $sum: 1 } } }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var result = {};
            if(global._bot && global._bot[req.params.botId])
            {
                result.list = list
                result.botScenario = global._bot[req.params.botId];
                res.jsonp(result);
            }
            else
            {
                botLib.loadBot(req.params.botId, function (realbot)
                {
                    result.list = list
                    result.botScenario = realbot.dialogs;
                    res.jsonp(result);
                })
            }
        }
    });
};
