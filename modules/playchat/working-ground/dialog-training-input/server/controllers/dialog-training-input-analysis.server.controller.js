var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');
var DialogsetDialog = mongoose.model('DialogsetDialog');

exports.analysis = function (req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    inOut: true,
                    isFail: false,
                    dialogType: 'qna',
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
                }
        },
        { $group: { _id: { dialog: '$dialog', dialogName: '$dialogName' }, count: {$sum: 1} } },
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            DialogsetDialog.populate(list, {path: 'dialogId'}, function(err, list)
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
        }
    });
};
