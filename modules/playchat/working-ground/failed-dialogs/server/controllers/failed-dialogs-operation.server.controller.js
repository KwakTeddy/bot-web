var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    var page = req.query.page || 1;
    var countPerPage = req.query.countPerPage || 50;

    var match = {};
    match.botId = req.params.botId;
    match.inOut = true;
    match.dialog = { $ne: null, $nin: [":reset user", ":build " + req.params.botId + " reset", ':build'] };
    match.isFail = true;
    // match.channel = { $ne: 'socket' };
    match.clear = { $not: new RegExp(req.query.ignoreType) };
    UserDialog.aggregate(
        [
            {$match: match},
            {$group: {_id: {dialog:'$dialog'}, id: {$first: '$_id'}, clear: {$first: '$clear'}, count: {$sum: 1}}},
            {$sort: {count: -1}},
            {$skip: (page-1) * countPerPage},
            {$limit: countPerPage < 300 ? countPerPage: 300}
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

module.exports.clear = function(req, res)
{
    var query = {
        botId: req.params.botId,
        isFail: true,
        dialog: req.body.dialog
    };
    if(req.body.preDialogId)
        query.preDialogId = req.body.preDialogId;

    UserDialog.update(query, { $set: { clear: req.body.clear || 'qna|graph|intent'} }, {multi: true}).exec(function(err, result)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(result);
        }
    });
};
