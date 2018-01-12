var path = require('path');
var engine = require(path.resolve('engine/bot/server/controllers/bot.server.controller.js'));
var master = require(path.resolve('engine/loadbalancer/master.js'));

var isMaster = process.env.LB_MASTER;

var callback = function (res, serverText, json)
{
    if(json == undefined || (json.result == undefined && json.image == undefined && json.buttons == undefined && json.items == undefined)) {
        res.write(serverText);
        res.end();
    } else if(json.result) {
        if(json.result.text == undefined) json.result.text = serverText;
        res.write(JSON.stringify(json.result));
        res.end();
    } else {
        json.text = serverText;
        json.topTask = undefined;
        res.write(JSON.stringify(json));
        res.end();
    }
};

exports.message = function (req, res)
{
    var msg = req.body;
    try
    {
        if(isMaster)
        {
            master.routing(msg.channel, msg.user, msg.bot, msg.text, msg, function(serverText, json)
            {
                callback(res, serverText, json);
            });
        }
        else
        {
            engine.write(msg.channel, msg.user, msg.bot, msg.text, msg, function(serverText, json)
            {
                callback(res, serverText, json);
            });
        }
    }
    catch(e)
    {
        console.error('에러 : ', e);
        res.write('');
        res.end();
    }
};
