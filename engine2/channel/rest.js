var path = require('path');
exports.message = function (req, res)
{
    var Engine = require(path.resolve('./engine2/core.js'));

    try
    {
        var from = req.body.user_key;
        var text = req.body.content;

        Engine.process(req.params.bot, 'rest', from, text, {}, function (context, out)
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
