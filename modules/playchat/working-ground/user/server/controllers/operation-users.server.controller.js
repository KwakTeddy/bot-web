var async = require('async');
var mongoose = require('mongoose');

var BotUser = mongoose.model('BotUser');
var UserDialog = mongoose.model('UserDialog');


exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { botId: req.params.botId };

    if(req.query.userKey)
        query.userKey = { "$regex": req.query.userKey, "$options": 'i' };

    BotUser.find(query).count(function(err, count)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ totalPage: Math.ceil(count / countPerPage) });
        }
    });
};

exports.find = function(req, res)
{
    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = { botId: req.params.botId };

    if(req.query.userKey)
        query.userKey = { "$regex": req.query.userKey, "$options": 'i' };

    BotUser.find(query).sort('-created').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, list)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var result = [];
            async.eachSeries(list, function(item, next)
            {
                item = JSON.parse(JSON.stringify(item));
                UserDialog.find({ botId: req.params.botId, userId: item.userKey, dialog: /^[^:]/ }).count(function(err, count)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    item.dialogCount = count;

                    result.push(item);

                    next();
                });
            },
            function()
            {
                res.jsonp(result);
            });
        }
    });
};
