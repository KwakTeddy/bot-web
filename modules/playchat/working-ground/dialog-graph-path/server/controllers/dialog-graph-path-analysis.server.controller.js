var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var query = [
        { $match: { botId: req.params.botId, inOut: false, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }, dialogId: { $nin: [null]} } },
        { $group: { _id: { dialogId: '$dialogId', preDialogId: '$preDialogId' }, dialogName: { $first: '$dialogName' }, dialog: { $first: '$dialog'} }},
        { $sort: { created: -1} }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
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
