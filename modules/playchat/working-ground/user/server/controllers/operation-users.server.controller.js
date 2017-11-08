var async = require('async');
var mongoose = require('mongoose');

var BotUser = mongoose.model('BotUser');
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

    // if(req.query.lastUpdateStart && req.query.lastUpdateEnd)
    // {
    //     query.lastUpdate = {"$gte": new Date(req.query.lastUpdateStart), "$lte": new Date(req.query.lastUpdateEnd)};
    // }
    //
    // if(req.query.dialogCountStart && req.query.dialogCountEnd)
    // {
    //     query.dialogCount = {"$gte": new Date(req.query.dialogCountStart), "$lte": new Date(req.query.dialogCountEnd)};
    // }

    if(req.query.createdStart && req.query.createdEnd)
    {
        query.created = {"$gte": new Date(req.query.createdStart), "$lte": new Date(req.query.createdEnd)};
    }
};

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { botId: req.params.botId };

    getQuerystring(req, query);

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

    getQuerystring(req, query);

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
