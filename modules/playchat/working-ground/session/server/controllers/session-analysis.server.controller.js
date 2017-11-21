var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');

module.exports.sessionUsage = function(req, res)
{
    UserDialog.find({ botId: req.params.botId, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }, channel : { $ne: 'socket' } }).sort({ created: 1 }).lean().exec(function(err, list)
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
