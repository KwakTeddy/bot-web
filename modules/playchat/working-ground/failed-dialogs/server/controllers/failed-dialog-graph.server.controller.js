var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var query = [
        {$match: { botId: req.params.botId, dialogType: 'graph', clear: {$not: /graph/}, dialog: {$nin: [':reset user', ':build']}, inOut: true, fail: true, preDialogId: {$ne: null}, preDialogName: {$ne: null}}},
        {$group: { _id: { dialog: '$dialog', preDialogId: '$preDialogId' }, preDialogName: {$first: '$preDialogName'}, id: {$first: '$_id'}, clear: {$first: '$clear'}, count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 100}
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.jsonp(list);
    });
};
