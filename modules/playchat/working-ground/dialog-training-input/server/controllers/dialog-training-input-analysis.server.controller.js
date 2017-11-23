var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog')
var DialogsetDialog = mongoose.model('DialogsetDialog');

exports.analysis = function (req, res)
{
    var query = [
        { $match: { botId: req.params.botId/*, channel: { $ne: 'socket' }*/, inOut: false, fail: false, dialogId: { $ne: null }, dialogName: null, preDialogId: null, dialogType: 'qna', created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }} },
        { $group: { _id: { dialog: '$dialog', preDialogName: '$preDialogName' }, dialogId: { $first: '$dialogId' }, count: {$sum: 1} } },
        {
            $project:{
                _id: '$_id',
                dialogId: '$dialogId',
                count: '$count'
            }
        }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            console.log('리절트 : ', list);
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
