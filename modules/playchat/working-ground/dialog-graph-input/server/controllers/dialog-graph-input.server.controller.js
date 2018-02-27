var path = require('path');

var bot_js = require(path.resolve('./engine2/bot.js'));

var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var botId = req.params.botId;

    var query = [
        { $match:
                {
                    botId: botId,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
                    inOut: true,
                    dialogType: 'dialog',
                    dialogId: {$nin: [null, 'startDialog']},
                    dialogName: {$ne: null},
                    nlpDialog: {$nin: [':build', ':reset uesr']}
                }
        },
        { $group: { _id: { dialogName: '$dialogName', dialog: '$nlpDialog'}, count: { $sum: 1 } } }
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
            bot_js.load(botId, function () {
                result.list = list;
                result["botScenario"] = bot_js.bots[req.params.botId].dialogs;
                res.jsonp(result);
            });
        }
    });
};
