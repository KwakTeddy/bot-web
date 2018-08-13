var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var botId = req.params.botId;

    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    UserDialog.aggregate([
        {$match:
                {
                    botId: botId,
                    created: {$gte: new Date(startDate), $lte: new Date(endDate) },
                    dialogName: {$nin: ["답변없음"]},
                    inOut: false,
                    isFail: false,
                    dialogType: 'qna'
                }
        },
        {$group: { _id: '$dialog', count: {$sum: 1} }},
        {$sort: { count: -1 }}
    ]).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ list: list });
        }
    });
};
