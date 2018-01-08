var path = require('path');
var engine = require(path.resolve('engine/bot/server/controllers/bot.server.controller.js'));
var master = require(path.resolve('engine/loadbalancer/master.js'));

var isMaster = process.env.isMaster;

var callback = function (serverText, json)
{
    console.log('왔습니다');
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
    console.log('여기지? : ', JSON.stringify(req.body));

    var msg = req.body;
    try
    {
        if(isMaster)
        {
            master.routing(msg.channel, msg.user, msg.bot, msg.text, msg, callback);
        }
        else
        {
            engine.write(msg.channel, msg.user, msg.bot, msg.text, msg, callback);
        }
    }
    catch(e)
    {
        console.error('에러 : ', e);
        res.write('');
        res.end();
    }
};
