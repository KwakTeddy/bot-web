var path = require('path');
var exec = require('child_process').exec;

const key = '7xvzp94167v4avnv';

(function()
{
    var Message = function()
    {

    };

    Message.prototype.result = function(req, res)
    {
        res.status(200).end();
    };

    Message.prototype.sms = function(req, res)
    {
        var Engine = require(path.resolve('./engine2/core.js'));
        exec('java CipherAES ' + key + ' ' + req.rawBody, function callback(error, stdout, stderr)
        {
            var data = JSON.parse(stdout);

            console.log('문자수신: ', data);

            var text = data.body.message;
            var userKey = data.body.sender;

            Engine.process(req.params.bot, 'message', userKey, text, {}, function (context, out)
            {
                console.log('챗봇결과: ', out.output);
            },
            function(err)
            {
                console.error(err);
            });
        });

        res.status(200).end();
    };

    Message.prototype.mms = function(req, res)
    {
        res.status(200).end();
    };

    module.exports = new Message();
})();
