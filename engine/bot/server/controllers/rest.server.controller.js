var path = require('path');
var master = require(path.resolve('engine/loadbalancer/master.js'));

exports.message = function (req, res)
{
    console.log(JSON.stringify(req.body));

    var msg = req.body;
    try
    {
        master.routing(msg.channel, msg.user, msg.bot, msg.text, msg, function (serverText, json)
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
        });
    }
    catch(e)
    {
        console.error('에러 : ', e);
        res.write('');
        res.end();
    }
};
