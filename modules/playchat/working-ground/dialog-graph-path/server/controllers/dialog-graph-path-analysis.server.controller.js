var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');

module.exports.analysis = function(req, res)
{
    UserDialog.find({ botId: req.params.botId, inOut: false, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }, dialogId: { $nin: [null]} }).sort({ created: 1 }).exec(function(err, list)
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
