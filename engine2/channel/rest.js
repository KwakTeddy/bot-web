var path = require('path');
exports.message = function (req, res)
{
    var Engine = require(path.resolve('./engine2/core.js'));

    try
    {
        var userKey = req.body.userKey;
        var text = req.body.text;
        var channel = req.body.channel;

        Engine.process(req.params.bot, channel || 'rest', userKey, text, {}, function (context, out)
        {
            res.send(out.output);
        },
        function(err)
        {
            res.send({ text: JSON.stringify(err) });
        });
    }
    catch(e)
    {
        console.error('에러 : ', e);
        res.write('');
        res.end();
    }
};
