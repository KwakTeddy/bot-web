var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

var async = require('async');
var mongoose = require('mongoose');

var BotUser = mongoose.model('BotUser');
var BotUserMemo = mongoose.model('BotUserMemo');
var UserDialog = mongoose.model('UserDialog');

var getQuerystring = function(req, query)
{
    if(req.query.userKey)
    {
        query.userKey = { "$regex": req.query.userKey, "$options": 'i' };
    }

    if(req.query.channel)
    {
        query.channel = { "$regex": req.query.channel, "$options": 'i' };
    }

    if(req.query.mobile)
    {
        query.mobile = { "$regex": req.query.mobile, "$options": 'i' };
    }

    if(req.query.createdStart && req.query.createdEnd)
    {
        query.created = {"$gte": new Date(req.query.createdStart), "$lte": new Date(req.query.createdEnd)};
    }

    if(req.query.search)
    {
        var searchQuery = {};
        searchQuery['$and'] = [];
        searchQuery.$and.push(query);
        searchQuery.$and.push({
            $or : [
                { channel: { $regex: req.query.search } },
                { userKey: { $regex: req.query.search } },
                { mobile: { $regex: req.query.search } }
            ]
        });

        query = searchQuery;
    };

    return query;
};

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { botId: req.params.botId };

    query = getQuerystring(req, query);

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

    query = getQuerystring(req, query);

    if(req.query.neSocket)
    {
        // query.channel = { $ne: "socket" };
    }

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

                    //만약 count search 조건에 해당하지 않으면 result에 추가하지 않는다.
                    if(req.query.dialogCountStart && req.query.dialogCountEnd && (req.query.dialogCountStart > count || count > req.query.dialogCountEnd))
                    {
                        return next();
                    }

                    // lastUpdate를 가져오기 위한 쿼리.
                    // 그런데 만약 검색조건이 있다면 넣어줘야 함.
                    var queryParam = { botId: req.params.botId, userId: item.userKey };
                    if(req.query.lastUpdateStart && req.query.lastUpdateEnd)
                    {
                        queryParam.created = {"$gte": new Date(req.query.lastUpdateStart), "$lte": new Date(req.query.lastUpdateEnd)};
                    }

                    UserDialog.findOne(queryParam).sort('-created').exec(function(err, userDialog)
                    {
                        if(err)
                        {
                            return res.status(400).send({ message: err.stack || err });
                        }

                        // 검색 조건이 들어갔다면 userDialog가 없을때 검색 결과에 포함시키지 않아야 한다.
                        if(userDialog)
                        {
                            // userDialog가 있으면 lastUpdate에 created를 저장해주고.
                            item.lastUpdate = userDialog.created;
                            result.push(item);
                        }
                        else if(!queryParam.created)
                        {
                            // 만약 검색 조건이 없을 때는 lastUpdate가 없어도 결과는 나와야 함.
                            result.push(item);
                        }

                        next();
                    });
                });
            },
            function()
            {
                res.jsonp(result);
            });
        }
    });
};

module.exports.findOne = function(req, res)
{
    BotUser.findOne({ botId: req.params.botId, _id: req.params._id }).exec(function(err, item)
    {
        if (err)
        {
            return res.status(400).send({message: err.stack || err});
        }
        else
        {
            item = JSON.parse(JSON.stringify(item));
            var query = { botId: req.params.botId, userId: item.userKey };

            if(req.query.liveChat)
            {
                query.liveChat = true;
            }

            UserDialog.find(query).limit(50).sort('-created').sort('-inOut').exec(function(err, userDialog)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                item.userDialog = userDialog;
                // if(userDialog)
                // {
                //     // userDialog가 있으면 lastUpdate에 created를 저장해주고.
                //     item.lastUpdate = userDialog.created;
                //     item.newMsg = userDialog.dialog;
                // }

                res.jsonp(item);
            });
        }
    });
};

module.exports.findMemo = function(req, res)
{
    BotUserMemo.find({ botId: req.params.botId, userKey: req.params.userKey }).sort('-created').lean().exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.jsonp(list);
    });
};

module.exports.saveMemo = function(req, res)
{
    var memo = new BotUserMemo();
    memo.botId = req.params.botId;
    memo.userKey = req.params.userKey;
    memo.memo = req.body.memo;

    memo.save(function(err)
    {
        if(err)
        {
            res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(memo);
        }
    });
};
